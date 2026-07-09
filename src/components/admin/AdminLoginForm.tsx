"use client";

import { useActionState, useState } from "react";

import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import {
  loginAdmin,
  type AdminLoginState,
} from "@/app/admin/actions";

const initialState: AdminLoginState = {
  success: false,
};

export function AdminLoginForm() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [state, formAction, isPending] =
    useActionState(loginAdmin, initialState);

  return (
    <form
      action={formAction}
      className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-9"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[#801a32]/25 blur-3xl" />

      <div className="relative">
        <div className="mb-8">
          <div className="mb-5 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white">
            <LockKeyhole className="size-5" />
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#c04a62]">
            Yönetim Paneli
          </p>

          <h1 className="mt-4 font-serif text-4xl tracking-tight text-white">
            Admin girişi
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/45">
            Katılım cevaplarını görüntülemek için
            admin şifrenizi girin.
          </p>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-white/45"
          >
            Admin Şifresi
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              placeholder="Şifrenizi girin"
              required
              autoFocus
              className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 pr-14 text-white outline-none transition placeholder:text-white/20 focus:border-[#9b2942] focus:ring-4 focus:ring-[#7e1930]/20"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (currentValue) =>
                    !currentValue,
                )
              }
              aria-label={
                showPassword
                  ? "Şifreyi gizle"
                  : "Şifreyi göster"
              }
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl text-white/35 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9b2942]/60"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          </div>
        </div>

        {state.message && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-red-400/15 bg-red-500/10 p-4 text-sm text-red-200"
          >
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#7b172e] px-6 font-medium text-white transition hover:bg-[#981d38] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-5 animate-spin" />
              Giriş yapılıyor...
            </>
          ) : (
            "Giriş Yap"
          )}
        </button>
      </div>
    </form>
  );
}