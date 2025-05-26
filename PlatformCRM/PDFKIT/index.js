import pdfkit from "pdfkit";
import fs from "fs";

const pdfdocument = new pdfkit();

pdfdocument.pipe(fs.createWriteStream("output.pdf"));

pdfdocument.image("fashion2.png", {
  fit: [250, 300],
  align: "center",
  valign: "center",
});

pdfdocument.text("HELLO WORLD").fontSize(25);

pdfdocument.addPage().text(`C'est une autre page du pdf`).fontSize(50);

pdfdocument.end();
