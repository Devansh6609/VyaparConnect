// src/lib/crypto.ts
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  pbkdf2Sync,
} from "crypto";
import { Buffer } from "node:buffer";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
// This static salt is used to derive a key. It's not a secret itself.
const SALT = "a-static-salt-for-vyaparconnect-app";

function getKey(userId: string): Buffer {
  if (!userId) {
    throw new Error("A user ID must be provided for cryptographic operations.");
  }
  // Derive a 32-byte (256-bit) key from the user ID and a static salt.
  // This is more secure than using the ID directly and avoids needing an environment variable.
  return pbkdf2Sync(userId, SALT, 100000, 32, "sha512");
}

export function encrypt(text: string, userId: string): string {
  const key = getKey(userId);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
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

export function decrypt(encryptedText: string, userId: string): string {
  const key = getKey(userId);
  const parts = encryptedText.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted text format.");
  }

  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const encrypted = Buffer.from(parts[2], "hex");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
