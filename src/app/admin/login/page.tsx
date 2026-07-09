import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Girişi | Birinci Yıl Daveti",
};

export default async function AdminLoginPage() {
  const isAuthenticated =
    await isAdminAuthenticated();

  if (isAuthenticated) {
    redirect("/admin");
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#050505] px-4 py-10">
      <div className="pointer-events-none absolute -left-48 top-10 size-[34rem] rounded-full bg-[#661125]/25 blur-[140px]" />

      <div className="pointer-events-none absolute -right-48 bottom-0 size-[38rem] rounded-full bg-[#8e1e38]/20 blur-[160px]" />

      <div className="relative w-full max-w-md">
        <AdminLoginForm />

        <Link
          href="/"
          className="mx-auto mt-6 block w-fit text-xs text-white/35 transition hover:text-white"
        >
          ← Davetiye sayfasına dön
        </Link>
      </div>
    </main>
  );
}