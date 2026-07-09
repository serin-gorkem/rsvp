import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "birinci_yil_admin_session";

const SESSION_DURATION_SECONDS =
  60 * 60 * 24 * 7; // 7 gün

function getRequiredEnvironmentVariable(
  name: "ADMIN_PASSWORD" | "SESSION_SECRET",
): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} environment değişkeni tanımlanmamış.`,
    );
  }

  return value;
}

function createSessionSignature(
  expiresAt: number,
): string {
  const sessionSecret =
    getRequiredEnvironmentVariable("SESSION_SECRET");

  return createHmac("sha256", sessionSecret)
    .update(`admin:${expiresAt}`)
    .digest("hex");
}

function safeCompare(
  firstValue: string,
  secondValue: string,
): boolean {
  const firstHash = createHash("sha256")
    .update(firstValue)
    .digest();

  const secondHash = createHash("sha256")
    .update(secondValue)
    .digest();

  return timingSafeEqual(firstHash, secondHash);
}

export function verifyAdminPassword(
  password: string,
): boolean {
  const adminPassword =
    getRequiredEnvironmentVariable("ADMIN_PASSWORD");

  return safeCompare(password, adminPassword);
}

export async function createAdminSession(): Promise<void> {
  const expiresAt =
    Date.now() + SESSION_DURATION_SECONDS * 1000;

  const signature =
    createSessionSignature(expiresAt);

  const sessionToken = `${expiresAt}.${signature}`;

  const cookieStore = await cookies();

  cookieStore.set(
    ADMIN_COOKIE_NAME,
    sessionToken,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    },
  );
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    ADMIN_COOKIE_NAME,
  )?.value;

  if (!sessionToken) {
    return false;
  }

  const [expiresAtValue, signature] =
    sessionToken.split(".");

  if (!expiresAtValue || !signature) {
    return false;
  }

  const expiresAt = Number(expiresAtValue);

  if (
    !Number.isFinite(expiresAt) ||
    expiresAt <= Date.now()
  ) {
    return false;
  }

  const expectedSignature =
    createSessionSignature(expiresAt);

  return safeCompare(
    signature,
    expectedSignature,
  );
}

export async function requireAdmin(): Promise<void> {
  const isAuthenticated =
    await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_COOKIE_NAME);
}