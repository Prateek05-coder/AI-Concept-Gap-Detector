
import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // often needed for supabase hosted db
    });

    try {
        await client.connect();
        await client.query('DROP TABLE IF EXISTS diagnostics CASCADE;');
        console.log("Dropped diagnostics table");
    } catch (err) {
        console.error("Error dropping table:", err);
    } finally {
        await client.end();
    }
}

main();
