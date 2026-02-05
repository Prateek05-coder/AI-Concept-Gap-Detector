
import fs from 'fs';
import path from 'path';

async function main() {
    const filePath = path.join(__dirname, 'test.png');
    // Minimal PNG
    const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNiAAAABgADNjd8qAAAAABJRU5ErkJggg==";
    fs.writeFileSync(filePath, Buffer.from(pngBase64, 'base64'));

    const formData = new FormData();
    formData.append("user_explanation", "This is a test upload with a PNG file.");
    formData.append("concept_name", "Test Concept");
    formData.append("user_id", "test-user-123");

    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'image/png' });
    formData.append("file", blob, "test.png");

    console.log("Sending request...");
    try {
        const res = await fetch("http://localhost:5000/api/diagnose", {
            method: "POST",
            body: formData,
        });

        console.log("Status:", res.status);
        const json = await res.json();
        // Truncate long fields for cleaner log
        if (json && json.userExplanation) json.userExplanation = json.userExplanation.substring(0, 50) + "...";
        console.log("Response:", JSON.stringify(json, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

main();
