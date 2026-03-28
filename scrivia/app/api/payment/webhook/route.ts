import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/maketou";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-maketou-signature") ?? "";

    // Vérifier la signature webhook
    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Signature invalide." }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { reference, status, metadata } = payload;

    if (!reference) {
      return NextResponse.json({ error: "Référence manquante." }, { status: 400 });
    }

    // Mettre à jour le paiement en base
    const payment = await prisma.payment.updateMany({
      where: { reference },
      data:  { status },
    });

    if (payment.count === 0) {
      return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });
    }

    // Si paiement confirmé → déclencher la génération du document
    if (status === "success" || status === "completed") {
      const dbPayment = await prisma.payment.findFirst({
        where: { reference },
      });

      if (dbPayment) {
        // Créer une entrée Document en PROCESSING
        await prisma.document.create({
          data: {
            userId:      dbPayment.userId,
            serviceId:   dbPayment.serviceId,
            serviceName: metadata?.serviceName ?? dbPayment.serviceId,
            language:    metadata?.language ?? "fr",
            format:      metadata?.format ?? "pdf",
            status:      "PROCESSING",
            fields:      metadata?.fields ?? {},
          },
        });

        // Incrémenter docsUsed
        await prisma.user.update({
          where: { id: dbPayment.userId },
          data:  { docsUsed: { increment: 1 } },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Erreur serveur." },
      { status: 500 }
    );
  }
}
