// src/app/api/members/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/member";

export async function GET() {
  try {
    await dbConnect();
    const data = await Member.find();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newMember = new Member(body);
    await newMember.save();
    return NextResponse.json(
      { success: true, data: newMember },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
