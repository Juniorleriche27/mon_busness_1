import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { getPrompt } from "@/lib/prompts";
import { getServiceById } from "@/lib/catalog";
import { generatePdf } from "@/lib/generate-pdf";
import { generateDocx } from "@/lib/generate-docx";
import { generateXlsx } from "@/lib/generate-xlsx";
import { uploadDocument } from "@/lib/cloudinary";

type Format = "pdf" | "docx" | "xlsx";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  try {
    const { serviceId, fields, language = "fr", format = "pdf" } = await req.json();

    // ── 1. Vérifications ────────────────────────────────
    const service = getServiceById(serviceId);
    if (!service) {
      return NextResponse.json({ error: "Service introuvable." }, { status: 400 });
    }

    const promptDef = getPrompt(serviceId);
    if (!promptDef) {
      return NextResponse.json({ error: "Prompt non configuré pour ce service." }, { status: 400 });
    }

    // Vérifier quota utilisateur
    const user = await prisma.user.findUnique({
      where:  { id: session.user.id },
      select: { docsUsed: true, docsLimit: true },
    });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }
    if (user.docsUsed >= user.docsLimit) {
      return NextResponse.json(
        { error: "Quota de documents atteint. Passez à un plan supérieur." },
        { status: 403 }
      );
    }

    // ── 2. Créer l'entrée Document (PROCESSING) ─────────
    const doc = await prisma.document.create({
      data: {
        userId:      session.user.id,
        serviceId,
        serviceName: service.title,
        language,
        format,
        status:      "PROCESSING",
        fields,
      },
    });

    // ── 3. Appel Claude API ──────────────────────────────
    const userMessage = promptDef.userTemplate(fields, language);

    const message = await anthropic.messages.create({
      model:      CLAUDE_MODEL,
      max_tokens: 4096,
      system:     promptDef.system,
      messages:   [{ role: "user", content: userMessage }],
    });

    const content = message.content
      .filter(b => b.type === "text")
      .map(b => (b as any).text)
      .join("\n");

    if (!content.trim()) {
      await prisma.document.update({
        where: { id: doc.id },
        data:  { status: "FAILED" },
      });
      return NextResponse.json({ error: "Génération IA échouée." }, { status: 500 });
    }

    // ── 4. Génération du fichier ─────────────────────────
    const title = service.title;
    let buffer: Buffer;
    let mimeType: string;
    let extension: string;

    switch (format as Format) {
      case "docx":
        buffer    = await generateDocx({ content, title, serviceName: service.title });
        mimeType  = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        extension = "docx";
        break;
      case "xlsx":
        buffer    = await generateXlsx({ content, title, serviceName: service.title });
        mimeType  = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        extension = "xlsx";
        break;
      default:
        buffer    = await generatePdf({ content, title, serviceName: service.title });
        mimeType  = "application/pdf";
        extension = "pdf";
        break;
    }

    // ── 5. Upload Cloudinary ─────────────────────────────
    const fileName = `${session.user.id}/${serviceId}-${doc.id}.${extension}`;
    const fileUrl  = await uploadDocument(buffer, fileName);

    // ── 6. Mettre à jour le document en base ─────────────
    const updated = await prisma.document.update({
      where: { id: doc.id },
      data:  { status: "DONE", fileUrl },
    });

    // Incrémenter docsUsed
    await prisma.user.update({
      where: { id: session.user.id },
      data:  { docsUsed: { increment: 1 } },
    });

    return NextResponse.json({
      documentId: updated.id,
      fileUrl,
      status:     "DONE",
    });
  } catch (err: any) {
    console.error("[/api/generate]", err);
    return NextResponse.json(
      { error: err.message ?? "Erreur serveur." },
      { status: 500 }
    );
  }
}
