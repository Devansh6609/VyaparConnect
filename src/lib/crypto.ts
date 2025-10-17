// src/lib/crypto.ts
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

// The ENCRYPTION_KEY environment variable must be a 64-character hex string (32 bytes).
// It can be generated with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");

function validateKey() {
  if (KEY.length !== 32) {
    throw new Error(
      "Invalid ENCRYPTION_KEY environment variable. It must be a 64-character hex string."
    );
  }
}

export function encrypt(text: string): string {
  validateKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  // We store iv, authTag, and the encrypted data together, separated by a colon, in a hex string.
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString(
    "hex"
  )}`;
}

export function decrypt(encryptedText: string): string {
  validateKey();
  const parts = encryptedText.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted text format.");
  }

  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const encrypted = Buffer.from(parts[2], "hex");

  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
