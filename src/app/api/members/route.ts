import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const members = await prisma.member.findMany();
  return NextResponse.json(members);
}

export async function POST(request: Request) {
  const data = await request.json();
  const lastMember = await prisma.member.findFirst({
    orderBy: { serialNumber: "desc" },
  });

  const serialNumber = lastMember ? lastMember.serialNumber + 1 : 1;

  const newMember = await prisma.member.create({
    data: { ...data, serialNumber },
  });

  return NextResponse.json(newMember);
}
