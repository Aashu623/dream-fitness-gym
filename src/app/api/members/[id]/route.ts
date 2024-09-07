import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const member = await prisma.member.findUnique({
    where: { id: params.id },
  });
  return NextResponse.json(member);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const updatedMember = await prisma.member.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(updatedMember);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.member.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}
