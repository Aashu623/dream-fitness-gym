// utils/pdfGenerator.ts
import { PDFDocument, rgb } from "pdf-lib";

export async function generatePDF(memberData: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const { width, height } = page.getSize();

  page.drawText("Dream Fitness", {
    x: 50,
    y: height - 80,
    size: 30,
    color: rgb(0, 0, 1),
  });

  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: height - 120,
    size: 12,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Bill to: ${memberData.name}`, {
    x: 50,
    y: height - 160,
    size: 12,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Address: ${memberData.address}`, {
    x: 50,
    y: height - 180,
    size: 12,
    color: rgb(0, 0, 0),
  });

  // Add more details as needed

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
