
import mammoth from 'mammoth';

async function verify() {
    console.log("Verifying mammoth...");
    try {
        // Mammoth needs a real zip-based docx buffer to work, or it will throw.
        // Creating a fake docx buffer is hard manually.
        // But checking if it imports and has the right methods is a good start.

        if (typeof mammoth.extractRawText === 'function') {
            console.log("mammoth.extractRawText is a function.");
        } else {
            throw new Error("mammoth.extractRawText is missing");
        }

        // Pass invalid buffer to see if it handles error gracefully
        const buffer = Buffer.from("Not a zip");
        try {
            await mammoth.extractRawText({ buffer });
        } catch (e: any) {
            console.log("mammoth executed (error expected for invalid buffer):", e.message.substring(0, 50));
            // Mammoth usually says "Can't find end of central directory" (zip error)
        }

    } catch (e) {
        console.error("Critical Error verifying mammoth:", e);
        process.exit(1);
    }
}

verify();
