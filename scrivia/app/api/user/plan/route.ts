import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Plan } from "@prisma/client";

const PLAN_LIMITS: Record<Plan, number> = {
  FREE:     1,
  STARTER:  5,
  PRO:      20,
  BUSINESS: 999,
};

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { plan } = await req.json();

  if (!Object.values(Plan).includes(plan)) {
    return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      plan,
      docsLimit: PLAN_LIMITS[plan as Plan],
    },
    select: { id: true, plan: true, docsLimit: true },
  });

  return NextResponse.json({ user: updated });
}
