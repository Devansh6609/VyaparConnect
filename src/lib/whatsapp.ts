// lib/whatsapp.ts

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendMessageWithRetry(
  payload: object,
  token: string,
  phoneId: string
) {
  const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, options);

      if (res.ok) {
        return await res.json();
      }

      const errorBody = await res.json().catch(() => ({}));
      console.error(
        `Attempt ${attempt}/${MAX_RETRIES} failed with status ${res.status}:`,
        JSON.stringify(errorBody)
      );

      if (res.status >= 400 && res.status < 500) {
        console.error("Client error, not retrying.");
        return null;
      }

      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    } catch (error) {
      console.error(
        `Attempt ${attempt}/${MAX_RETRIES} failed with network error:`,
        error
      );
      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  console.error(`Failed to send message after ${MAX_RETRIES} attempts.`);
  return null;
}

interface WhatsAppCredentials {
  token: string;
  phoneId: string;
}

async function sendWhatsAppMessage(
  to: string,
  text: string,
  creds: WhatsAppCredentials,
  replyToWamid?: string | null
) {
  const payload: any = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { body: text },
  };
  if (replyToWamid) {
    payload.context = { message_id: replyToWamid };
  }
  return sendMessageWithRetry(payload, creds.token, creds.phoneId);
}

async function sendWhatsAppImageMessage(
  to: string,
  imageUrl: string,
  caption: string,
  creds: WhatsAppCredentials,
  replyToWamid?: string | null
) {
  const imagePayload: { link: string; caption?: string } = {
    link: imageUrl,
  };

  if (caption && caption.trim()) {
    imagePayload.caption = caption;
  }

  const payload: any = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "image",
    image: imagePayload,
  };
  if (replyToWamid) {
    payload.context = { message_id: replyToWamid };
  }
  return sendMessageWithRetry(payload, creds.token, creds.phoneId);
}

async function sendWhatsAppDocumentMessage(
  to: string,
  docUrl: string,
  caption: string,
  filename: string,
  creds: WhatsAppCredentials,
  replyToWamid?: string | null
) {
  const payload: any = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "document",
    document: {
      link: docUrl,
      caption: caption,
      filename: filename,
    },
  };
  if (replyToWamid) {
    payload.context = { message_id: replyToWamid };
  }
  return sendMessageWithRetry(payload, creds.token, creds.phoneId);
}

export {
  sendWhatsAppMessage,
  sendWhatsAppImageMessage,
  sendWhatsAppDocumentMessage,
};
export type { WhatsAppCredentials };
