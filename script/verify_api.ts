// Using global fetch (Node 18+)

async function verify() {
    console.log("Verifying API with new key...");

    const formData = new FormData();
    formData.append("user_explanation", "My code is throwing an error but I don't know why.");
    formData.append("concept_name", "Debugging");
    formData.append("session_id", "test-session-123");
    formData.append("user_id", "test-user");

    try {
        const res = await fetch("http://localhost:5000/api/diagnose", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("API Error:", res.status, text);
            process.exit(1);
        }

        const data = await res.json();
        console.log("Success! API Response:", JSON.stringify(data, null, 2));

        if (data.root_cause && data.confidence) {
            console.log("Verification PASSED: Detailed analysis received.");
        } else {
            console.error("Verification FAILED: Incomplete response.");
            process.exit(1);
        }

    } catch (err) {
        console.error("Network Error:", err);
        process.exit(1);
    }
}

verify();
