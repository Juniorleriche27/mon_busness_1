/**
 * Client Maketou — Paiements Mobile Money & Carte
 * Intégration à compléter avec la doc officielle Maketou
 */

const MAKETOU_API_URL = "https://api.maketou.com/v1"; // à confirmer avec la doc

interface InitiatePaymentParams {
  amount:    number;
  fees:      number;
  total:     number;
  reference: string;
  serviceId: string;
  provider:  "wave" | "orange" | "mtn" | "card";
  callbackUrl: string;
  returnUrl:   string;
  customerEmail?: string;
  customerName?:  string;
}

interface InitiatePaymentResult {
  paymentUrl: string;
  reference:  string;
  status:     string;
}

export async function initiatePayment(
  params: InitiatePaymentParams
): Promise<InitiatePaymentResult> {
  const apiKey = process.env.MAKETOU_API_KEY;
  if (!apiKey) throw new Error("MAKETOU_API_KEY non défini.");

  const res = await fetch(`${MAKETOU_API_URL}/payments/initiate`, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      amount:        params.total,
      currency:      "XOF",
      reference:     params.reference,
      payment_method:params.provider,
      callback_url:  params.callbackUrl,
      return_url:    params.returnUrl,
      metadata: {
        serviceId:    params.serviceId,
        baseAmount:   params.amount,
        fees:         params.fees,
      },
      customer: {
        email: params.customerEmail,
        name:  params.customerName,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Maketou error: ${err}`);
  }

  return res.json();
}

export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const secret = process.env.MAKETOU_WEBHOOK_SECRET;
  if (!secret) return false;

  // Vérification HMAC-SHA256 — adapter selon doc Maketou
  const crypto = require("crypto");
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return expected === signature;
}
