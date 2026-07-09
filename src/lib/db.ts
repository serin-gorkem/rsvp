import { neon } from "@neondatabase/serverless";

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment değişkeni bulunamadı.",
    );
  }

  return neon(databaseUrl);
}