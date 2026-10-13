import { NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "aklein_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type AdminSessionUser = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN";
};

export type AdminSession = {
  user: AdminSessionUser;
  iat: number;
  exp: number;
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is missing");
  }

  if (secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters");
  }

  return secret;
}

function base64UrlEncode(value: string) {
  const bytes = textEncoder.encode(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  const normalized = padding ? base64.padEnd(base64.length + (4 - padding), "=") : base64;
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return textDecoder.decode(bytes);
}

function base64UrlDecodeBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  const normalized = padding ? base64.padEnd(base64.length + (4 - padding), "=") : base64;
  const binary = atob(normalized);

  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function readCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");

    if (rawName === name) {
      return rawValue.join("=") || null;
    }
  }

  return null;
}

async function getHmacKey() {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signValue(value: string) {
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(value));

  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

async function verifyValue(value: string, signature: string) {
  const key = await getHmacKey();

  return crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecodeBytes(signature),
    textEncoder.encode(value)
  );
}

export async function createAdminSessionToken(user: AdminSessionUser) {
  const now = Math.floor(Date.now() / 1000);
  const session: AdminSession = {
    user,
    iat: now,
    exp: now + ADMIN_SESSION_TTL_SECONDS,
  };

  const payload = base64UrlEncode(JSON.stringify(session));
  const signature = await signValue(payload);

  return `${payload}.${signature}`;
}

export async function readAdminSessionToken(token: string | null | undefined) {
  if (!token) {
    return null;
  }

  const [payloadPart, signaturePart] = token.split(".");

  if (!payloadPart || !signaturePart) {
    return null;
  }

  const isValid = await verifyValue(payloadPart, signaturePart);

  if (!isValid) {
    return null;
  }

  try {
    const session = JSON.parse(base64UrlDecode(payloadPart)) as AdminSession;

    if (!session?.user || session.user.role !== "ADMIN") {
      return null;
    }

    if (typeof session.exp !== "number" || session.exp * 1000 <= Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getAdminSessionFromRequest(request: { headers: Headers }) {
  const cookieHeader = request.headers.get("cookie");
  const token = readCookieValue(cookieHeader, ADMIN_SESSION_COOKIE);

  return readAdminSessionToken(token);
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  };
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_SESSION_COOKIE, token, getAdminSessionCookieOptions());
  return response;
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
