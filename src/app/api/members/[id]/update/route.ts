import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/member";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const {
    newAmount,
    newPlanStartDate,
    newReceiverName,
    newUtr,
    newPaymentMode,
    newDuration,
  } = await req.json();
  const memberId = params.id;

  try {
    await dbConnect(); // Ensure you're connecting to the database

    const member = await Member.findById(memberId);

    if (!member) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    // Initialize previousPlan if it does not exist
    if (!member.previousPlan) {
      member.previousPlan = [];
    }

    // Push the previous plan details
    member.previousPlan.push({
      amount: member.amount,
      utr: member.utr,
      receiverName: member.receiverName,
      paymentMode: member.paymentMode,
      duration: member.duration,
    });

    // Update current member details
    member.amount = newAmount;
    member.planStarted = newPlanStartDate;
    member.receiverName = newReceiverName;
    member.utr = newUtr;
    member.paymentMode = newPaymentMode;
    member.duration = newDuration;
    member.verified = true;

    await member.save();

    return NextResponse.json({ message: "Plan updated successfully" });
  } catch (error) {
    console.error("Error saving member:", error);
    return NextResponse.json(
      { message: "Failed to update member's plan", error },
      { status: 500 }
    );
  }
}
