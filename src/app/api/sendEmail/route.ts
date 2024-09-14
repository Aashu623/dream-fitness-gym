// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, memberDetails } = body;

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { name, email: memberEmail, age, gender, phone } = memberDetails;

    // Add content to the PDF
    page.drawText(`Member Registration Details`, {
      x: 50,
      y: 350,
      size: 24,
      color: rgb(0, 0, 0),
    });
    page.drawText(`Name: ${name}`, { x: 50, y: 300, size: 18 });
    page.drawText(`Email: ${memberEmail}`, { x: 50, y: 270, size: 18 });
    page.drawText(`Age: ${age}`, { x: 50, y: 240, size: 18 });
    page.drawText(`Gender: ${gender}`, { x: 50, y: 210, size: 18 });
    page.drawText(`Phone: ${phone}`, { x: 50, y: 180, size: 18 });

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
      },
    });

    // Send the PDF via email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your Gym Membership Registration Details",
      text: "Please find your registration details attached as a PDF.",
      attachments: [
        {
          filename: "member-details.pdf",
          content: pdfBytes,
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error) {
    return NextResponse.json({ message: "Error sending email", error }, { status: 500 });
  }
}
