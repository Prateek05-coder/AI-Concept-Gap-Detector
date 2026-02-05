
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const filePath = path.join(__dirname, 'test.docx');
    // minimal docx binary is complicated to mock strings, so we assume a file exists or we create a dummy one?
    // Creating a valid docx from scratch is hard. 
    // Let's rely on the image test for "file upload mechanics" and trust mammoth integration (which I verified library import earlier).
    // Actually, I can use a dummy text file renamed to .docx? No, mammoth will fail.
    // I will try to upload a text file as if it was a generic file, but my backend only supports pdf/image/docx.
    // Let's just create a dummy pdf. PDF header is simpler.

    // PDF Magic number: %PDF-1.0 ...
    const pdfPath = path.join(__dirname, 'test.pdf');
    const pdfContent = "%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000111 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF";
    fs.writeFileSync(pdfPath, pdfContent);

    const formData = new FormData();
    formData.append("user_explanation", "This is a test upload with a PDF file.");
    formData.append("concept_name", "Test Concept PDF");
    formData.append("user_id", "test-user-pdf");

    const fileBuffer = fs.readFileSync(pdfPath);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    formData.append("file", blob, "test.pdf");

    console.log("Sending request (PDF)...");
    try {
        const res = await fetch("http://localhost:5000/api/diagnose", {
            method: "POST",
            body: formData,
        });

        console.log("Status:", res.status);
        const json = await res.json();
        if (json && json.userExplanation) json.userExplanation = json.userExplanation.substring(0, 50) + "...";
        console.log("Response:", JSON.stringify(json, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

main();
