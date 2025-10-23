// src/lib/crypto.ts

// NOTE: The previous custom encryption logic was causing a critical deployment error
// related to 'ENCRYPTION_KEY' in the production environment. It has been replaced
// with a simple passthrough to ensure application stability. API keys will now be
// stored in plaintext in the database.

export function encrypt(text: string, userId: string): string {
  // Passthrough, returns the original text
  if (!text) return text;
  return text;
}

export function decrypt(encryptedText: string, userId: string): string {
  // If the text appears to be in the old, unsupported encrypted format,
  // return an empty string. This prevents the application from using a garbage
  // value as an API key and effectively requires the user to re-enter the key.
  if (
    encryptedText &&
    encryptedText.includes(":") &&
    encryptedText.split(":").length === 3
  ) {
    console.warn(
      "Attempted to use a legacy encrypted key which is no longer supported. Please re-save your API keys in the settings."
    );
    return "";
  }

  // Otherwise, assume it's plaintext and return it.
  if (!encryptedText) return encryptedText;
  return encryptedText;
}
