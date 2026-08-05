import crypto from "crypto";

export const SESSION_COOKIE = "ppf_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function sign(value) {
  return crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update(value)
    .digest("hex");
}

// Signed, timestamped token: "<issuedAt>.<hmac>". No server-side session
// store needed — validity is just "signature matches and isn't expired".
export function createSessionToken() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function isValidSessionToken(token) {
  if (!token) return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;
  if (sign(issuedAt) !== signature) return false;
  return Date.now() - Number(issuedAt) < MAX_AGE_SECONDS * 1000;
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: MAX_AGE_SECONDS,
  path: "/",
};
