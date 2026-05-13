import bcrypt from "bcryptjs";

const ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

/** Supports bcrypt hashes and legacy plain-text passwords in the database. */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
    return bcrypt.compare(plain, stored);
  }
  return plain === stored;
}
