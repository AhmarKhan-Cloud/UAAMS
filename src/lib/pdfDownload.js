const PDF_PAGE_WIDTH = 612;
const PDF_PAGE_HEIGHT = 792;
const PDF_LEFT_MARGIN = 50;
const PDF_TOP_MARGIN = 750;
const PDF_BOTTOM_MARGIN = 50;
const PDF_LINE_HEIGHT = 14;

const encoder = new TextEncoder();

const byteLength = (value) => encoder.encode(value).length;

const escapePdfText = (value) =>
  String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r/g, " ")
    .replace(/\n/g, " ");

const chunkLinesForPages = (lines) => {
  const maxLinesPerPage = Math.max(
    1,
    Math.floor((PDF_TOP_MARGIN - PDF_BOTTOM_MARGIN) / PDF_LINE_HEIGHT),
  );

  const pages = [];
  for (let index = 0; index < lines.length; index += maxLinesPerPage) {
    pages.push(lines.slice(index, index + maxLinesPerPage));
  }

  if (pages.length === 0) {
    pages.push([""]);
  }

  return pages;
};

const buildPageStream = (lines) => {
  const commands = ["BT", "/F1 11 Tf", `1 0 0 1 ${PDF_LEFT_MARGIN} ${PDF_TOP_MARGIN} Tm`];

  lines.forEach((line, index) => {
    if (index > 0) {
      commands.push(`0 -${PDF_LINE_HEIGHT} Td`);
    }
    commands.push(`(${escapePdfText(line)}) Tj`);
  });

  commands.push("ET");
  return commands.join("\n");
};

const createPdfBlob = (lines) => {
  const pages = chunkLinesForPages(lines);
  const totalObjects = 4 + pages.length * 2;
  const objects = new Array(totalObjects + 1).fill("");

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  const kids = [];
  pages.forEach((pageLines, index) => {
    const pageObjectId = 4 + index * 2;
    const contentObjectId = 5 + index * 2;
    const stream = buildPageStream(pageLines);

    kids.push(`${pageObjectId} 0 R`);
    objects[pageObjectId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_PAGE_WIDTH} ${PDF_PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectId} 0 R >>`;
    objects[contentObjectId] =
      `<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream`;
  });

  objects[2] = `<< /Type /Pages /Count ${pages.length} /Kids [${kids.join(" ")}] >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = new Array(totalObjects + 1).fill(0);

  for (let objectId = 1; objectId <= totalObjects; objectId += 1) {
    offsets[objectId] = byteLength(pdf);
    pdf += `${objectId} 0 obj\n${objects[objectId]}\nendobj\n`;
  }

  const xrefOffset = byteLength(pdf);
  pdf += `xref\n0 ${totalObjects + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let objectId = 1; objectId <= totalObjects; objectId += 1) {
    pdf += `${String(offsets[objectId]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

const sanitizeFileName = (value, fallback = "document.pdf") => {
  const name = String(value || "").trim();
  const normalized = name
    .replace(/[<>:"/\\|?*]+/g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase();

  if (!normalized) return fallback;
  return normalized.endsWith(".pdf") ? normalized : `${normalized}.pdf`;
};

const triggerBlobDownload = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = sanitizeFileName(fileName);
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const textToLines = (value) => String(value || "").split(/\r?\n/);

const downloadPdfDocument = ({ title = "Document", lines = [], fileName = "document.pdf" }) => {
  const preparedLines = [
    ...textToLines(title),
    "",
    ...lines.flatMap((line) => textToLines(line)),
  ];
  const blob = createPdfBlob(preparedLines);
  triggerBlobDownload(blob, fileName);
};

const downloadPdfFromUrl = async (url, fileName = "document.pdf") => {
  if (!url) {
    throw new Error("Missing download URL.");
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to download file (${response.status}).`);
  }

  const blob = await response.blob();
  triggerBlobDownload(blob, fileName);
};

export { downloadPdfDocument, downloadPdfFromUrl };
