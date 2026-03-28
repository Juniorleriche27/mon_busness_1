import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcFees } from "@/lib/fees";
import { initiatePayment } from "@/lib/maketou";
import { getServiceById } from "@/lib/catalog";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  try {
    const { serviceId, provider } = await req.json();

    const service = getServiceById(serviceId);
    if (!service || service.priceFcfa === null) {
      return NextResponse.json(
        { error: "Service introuvable ou sur devis." },
        { status: 400 }
      );
    }

    const { price, fees, total } = calcFees(service.priceFcfa);
    const reference = `SCR-${Date.now()}-${session.user.id.slice(0, 6)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    // Sauvegarder le paiement en base (statut pending)
    const payment = await prisma.payment.create({
      data: {
        userId:    session.user.id,
        amount:    price,
        fees,
        total,
        serviceId,
        status:    "pending",
        provider,
        reference,
      },
    });

    const result = await initiatePayment({
      amount:       price,
      fees,
      total,
      reference,
      serviceId,
      provider,
      callbackUrl:  `${appUrl}/api/payment/webhook`,
      returnUrl:    `${appUrl}/dashboard?payment=success`,
      customerEmail: session.user.email ?? undefined,
      customerName:  session.user.name ?? undefined,
    });

    return NextResponse.json({
      paymentUrl: result.paymentUrl,
      reference,
      paymentId:  payment.id,
      breakdown: { price, fees, total },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Erreur serveur." },
      { status: 500 }
    );
  }
}
