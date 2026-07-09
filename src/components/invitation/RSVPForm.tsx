"use client";

import { useActionState, useState } from "react";

import { Check, LoaderCircle, UserRound, UsersRound, X } from "lucide-react";

import { RSVPActionState, submitRsvp } from "@/app/actions";

const initialState: RSVPActionState = {
  success: false,
};

type AttendanceStatus = "attending" | "not_attending";

type FieldErrorProps = {
  messages?: string[];
};

function FieldError({ messages }: FieldErrorProps) {
  if (!messages?.length) {
    return null;
  }

  return <p className="mt-2 text-sm text-[#9b1c35]">{messages[0]}</p>;
}

const inputClassName =
  "h-14 w-full rounded-2xl border border-black/10 bg-white/75 px-4 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#7e1930] focus:ring-4 focus:ring-[#7e1930]/10";

export function RSVPForm() {
  const [attendanceStatus, setAttendanceStatus] =
    useState<AttendanceStatus>("attending");

  const [state, formAction, isPending] = useActionState(
    submitRsvp,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-[#eee7df]/95 p-6 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-8"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[#8b1d35]/10 blur-3xl" />

      <div className="relative">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#8b1d35]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#7e1930]">
              Katılım Bildirimi
            </p>
          </div>

          <h2 className="font-serif text-3xl leading-tight text-[#151313] sm:text-4xl">
            Sizi aramızda
            <span className="italic text-[#7e1930]"> görecek miyiz?</span>
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Organizasyon hazırlıkları için katılım durumunuzu aşağıdaki formdan
            bildirebilirsiniz.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-neutral-800"
            >
              Ad Soyad
            </label>

            <div className="relative">
              <UserRound
                aria-hidden="true"
                className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-400"
              />

              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Adınız ve soyadınız"
                required
                className={`${inputClassName} pl-12 pr-4`}
              />
            </div>

            <FieldError messages={state.errors?.fullName} />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-neutral-800"
            >
              Telefon Numarası
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="05xx xxx xx xx"
              required
              className={inputClassName}
            />

            <FieldError messages={state.errors?.phone} />
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-medium text-neutral-800">
              Katılım Durumu
            </legend>

            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  attendanceStatus === "attending"
                    ? "border-[#711429] bg-[#711429] text-white shadow-lg shadow-[#711429]/20"
                    : "border-black/10 bg-white/70 text-neutral-700 hover:border-[#7e1930]/35"
                }`}
              >
                <input
                  type="radio"
                  name="attendanceStatus"
                  value="attending"
                  checked={attendanceStatus === "attending"}
                  onChange={() => setAttendanceStatus("attending")}
                  className="sr-only"
                />

                <span className="flex items-center gap-3">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                      attendanceStatus === "attending"
                        ? "bg-white text-[#711429]"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    <Check className="size-4" />
                  </span>

                  <span>
                    <span className="block font-medium">Katılacağım</span>

                    <span
                      className={`mt-0.5 block text-xs ${
                        attendanceStatus === "attending"
                          ? "text-white/60"
                          : "text-neutral-500"
                      }`}
                    >
                      Sizinle olacağız
                    </span>
                  </span>
                </span>
              </label>

              <label
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  attendanceStatus === "not_attending"
                    ? "border-[#711429] bg-[#711429] text-white shadow-lg shadow-[#711429]/20"
                    : "border-black/10 bg-white/70 text-neutral-700 hover:border-[#7e1930]/35"
                }`}
              >
                <input
                  type="radio"
                  name="attendanceStatus"
                  value="not_attending"
                  checked={attendanceStatus === "not_attending"}
                  onChange={() => setAttendanceStatus("not_attending")}
                  className="sr-only"
                />

                <span className="flex items-center gap-3">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                      attendanceStatus === "not_attending"
                        ? "bg-white text-[#711429]"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    <X className="size-4" />
                  </span>

                  <span>
                    <span className="block font-medium">Katılamayacağım</span>

                    <span
                      className={`mt-0.5 block text-xs ${
                        attendanceStatus === "not_attending"
                          ? "text-white/60"
                          : "text-neutral-500"
                      }`}
                    >
                      Bu kez gelemeyeceğiz
                    </span>
                  </span>
                </span>
              </label>
            </div>

            <FieldError messages={state.errors?.attendanceStatus} />
          </fieldset>

          {attendanceStatus === "attending" && (
            <div>
              <label
                htmlFor="guestCount"
                className="mb-2 block text-sm font-medium text-neutral-800"
              >
                Toplam Kaç Kişi Katılacaksınız?
              </label>

              <div className="relative">
                <UsersRound
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-400"
                />

                <select
                  id="guestCount"
                  name="guestCount"
                  defaultValue="1"
                  className={`${inputClassName} appearance-none pl-12 pr-4`}
                >
                  {Array.from({ length: 3 }, (_, index) => index + 1).map(
                    (count) => (
                      <option key={count} value={count}>
                        {count} kişi
                      </option>
                    ),
                  )}
                </select>
              </div>

              <FieldError messages={state.errors?.guestCount} />
            </div>
          )}

          <div>
            <label
              htmlFor="note"
              className="mb-2 block text-sm font-medium text-neutral-800"
            >
              Not{" "}
              <span className="font-normal text-neutral-400">
                — İsteğe bağlı
              </span>
            </label>

            <textarea
              id="note"
              name="note"
              rows={3}
              placeholder="Eklemek istediğiniz bir not..."
              className="w-full resize-none rounded-2xl border border-black/10 bg-white/75 p-4 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#7e1930] focus:ring-4 focus:ring-[#7e1930]/10"
            />

            <FieldError messages={state.errors?.note} />
          </div>

          {state.message && (
            <div
              role="alert"
              className="rounded-2xl border border-[#9b1c35]/15 bg-[#9b1c35]/10 p-4 text-sm text-[#83172e]"
            >
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#711429] px-6 font-medium text-white shadow-lg shadow-[#711429]/20 transition hover:bg-[#8a1a33] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <LoaderCircle className="size-5 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              "Katılım Bilgimi Gönder"
            )}
          </button>

          <p className="text-center text-xs leading-5 text-neutral-500">
            Bilgileriniz yalnızca etkinlik organizasyonu ve katılım planlaması
            amacıyla kullanılacaktır.
          </p>
        </div>
      </div>
    </form>
  );
}
