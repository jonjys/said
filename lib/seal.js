import crypto from "crypto";

export function signSeal(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const mac = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${mac}`;
}

export function readSeal(token, secret) {
  const parts = String(token || "").split(".");
  if (parts.length !== 2) return null;
  const [body, mac] = parts;
  if (!body || !mac) return null;
  const expect = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof data?.text !== "string" || !data.text || typeof data.at !== "string" ||
        !Number.isFinite(Date.parse(data.at)) || typeof data.sid !== "string" || !data.sid) return null;
    return data;
  } catch {
    return null;
  }
}

export function hashLine(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex").slice(0, 16);
}
