import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export async function downloadPDF(elementId, fileName) {
  const element = document.getElementById(elementId);
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save(fileName + ".pdf");
}

export async function downloadWord(docData, fileName) {
  const paragraphs = [];

  docData.sections.forEach((section) => {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: section.title, bold: true, size: 28 })],
      })
    );
    section.rows.forEach((row) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: row[0] + ": " + row[1], size: 24 })],
        })
      );
    });
  });

  const doc = new Document({ sections: [{ children: paragraphs }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName + ".docx");
}
