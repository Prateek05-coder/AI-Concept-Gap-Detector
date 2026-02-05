
import 'dotenv/config';
import { supabase } from '../server/db';

async function verifyPersistence() {
    console.log("Starting persistence verification...");

    const testId = `test_user_${Date.now()}`;
    const testConcept = "Persistence Test Concept";
    const testExplanation = "This is a test explanation to verify DB storage.";
    const testRootCause = "Test Root Cause Analysis";
    const testConfidence = 99;

    // 1. Insert Data
    console.log("Inserting test record...");
    const insertPayload = {
        session_id: `session_${Date.now()}`,
        user_id: testId,
        concept_name: testConcept,
        user_explanation: testExplanation,
        root_cause: testRootCause,
        confidence: testConfidence,
        repair_question: "Test question?",
        missing_prerequisites: ["Test Prereq A", "Test Prereq B"],
        knowledge_coverage: 50
    };

    const { data: inserted, error: insertError } = await supabase
        .from('diagnostics')
        .insert(insertPayload)
        .select()
        .single();

    if (insertError) {
        console.error("INSERT FAILED:", insertError);
        process.exit(1);
    }
    console.log("Insert successful. ID:", inserted.id);

    // 2. Read Data Back
    console.log("Reading back record...");
    const { data: retrieved, error: readError } = await supabase
        .from('diagnostics')
        .select('*')
        .eq('id', inserted.id)
        .single();

    if (readError) {
        console.error("READ FAILED:", readError);
        process.exit(1);
    }

    // 3. Verify Equality
    console.log("Verifying fields...");
    const mismatch: string[] = [];

    if (retrieved.user_explanation !== testExplanation) mismatch.push(`Explanation mismatch: ${retrieved.user_explanation}`);
    if (retrieved.concept_name !== testConcept) mismatch.push(`Concept mismatch: ${retrieved.concept_name}`);
    if (retrieved.root_cause !== testRootCause) mismatch.push(`Root Cause mismatch: ${retrieved.root_cause}`);
    if (retrieved.user_id !== testId) mismatch.push(`User ID mismatch: ${retrieved.user_id}`);
    if (retrieved.confidence !== testConfidence) mismatch.push(`Confidence mismatch: ${retrieved.confidence}`);

    if (mismatch.length > 0) {
        console.error("VERIFICATION FAILED:");
        mismatch.forEach(m => console.error("- " + m));
        process.exit(1);
    }

    console.log("SUCCESS: All fields verified correctly in Database.");

    // Clean up
    await supabase.from('diagnostics').delete().eq('id', inserted.id);
    console.log("Test record cleaned up.");
}

verifyPersistence();
