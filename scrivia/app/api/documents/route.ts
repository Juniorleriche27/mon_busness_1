import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const documents = await prisma.document.findMany({
    where:   { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id:          true,
      serviceId:   true,
      serviceName: true,
      language:    true,
      format:      true,
      status:      true,
      fileUrl:     true,
      createdAt:   true,
    },
  });

  return NextResponse.json({ documents });
}
