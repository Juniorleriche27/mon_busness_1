import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;

  const doc = await prisma.document.findUnique({
    where: { id },
  });

  if (!doc) {
    return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
  }

  // Vérifier que le document appartient à l'utilisateur
  if (doc.userId !== session.user.id) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  if (!doc.fileUrl) {
    return NextResponse.json(
      { error: "Fichier non disponible." },
      { status: 404 }
    );
  }

  // Rediriger vers l'URL Cloudinary signée
  return NextResponse.redirect(doc.fileUrl);
}
