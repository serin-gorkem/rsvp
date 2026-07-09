import type { ReactNode } from "react";

import {
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";

import { RSVPForm } from "@/components/invitation/RSVPForm";
import { eventConfig } from "@/config/event";

type DetailItemProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function DetailItem({
  icon,
  label,
  value,
}: DetailItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
          {label}
        </p>

        <p className="mt-1.5 text-sm leading-6 text-white/80 sm:text-base">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#040404]">
      {/* Ambient wine lights */}
      <div className="pointer-events-none absolute -left-52 top-20 size-[34rem] rounded-full bg-[#681326]/20 blur-[130px]" />

      <div className="pointer-events-none absolute -right-52 bottom-0 size-[38rem] rounded-full bg-[#8c1d35]/20 blur-[150px]" />

      <div className="relative mx-auto grid min-h-screen max-w-[1500px] gap-4 px-4 py-4 lg:grid-cols-[1.05fr_0.95fr] lg:px-5">
        {/* Davet alanı */}
        <section className="relative flex min-h-[680px] overflow-hidden rounded-[2.25rem] border border-white/[0.07] bg-[#080808] p-7 text-white shadow-2xl shadow-black/40 sm:p-10 lg:min-h-[calc(100vh-2rem)] lg:p-12 xl:p-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-40 -top-40 size-[32rem] rounded-full border border-white/[0.05]" />

            <div className="absolute -right-24 -top-24 size-[22rem] rounded-full border border-white/[0.05]" />

            <div className="absolute bottom-0 left-0 h-[55%] w-full bg-gradient-to-t from-[#74152a]/45 via-[#3a0b15]/15 to-transparent" />

            <div className="absolute left-[15%] top-[20%] size-72 rounded-full bg-[#78182c]/10 blur-[100px]" />
          </div>

          <div className="relative flex w-full flex-col">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/45 sm:text-xs">
                {eventConfig.eyebrow}
              </p>

              <p className="font-serif text-sm italic text-white/40">
                Save the date
              </p>
            </div>

            <div className="my-auto py-12 sm:py-16">
              <p className="mb-5 font-serif text-2xl italic text-white/45 sm:text-3xl">
                {eventConfig.hostNames}
              </p>

              <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.045em] text-[#f3eee8] sm:text-6xl lg:text-[4.5rem] xl:text-[5.5rem]">
                {eventConfig.title}
              </h1>

              <div className="mt-7 h-px w-20 bg-[#98223d]" />

              <p className="mt-7 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
                {eventConfig.description}
              </p>

              <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                <DetailItem
                  icon={
                    <CalendarDays className="size-5" />
                  }
                  label="Tarih"
                  value={eventConfig.date}
                />

                <DetailItem
                  icon={<Clock3 className="size-5" />}
                  label="Saat"
                  value={eventConfig.time}
                />

                <DetailItem
                  icon={<MapPin className="size-5" />}
                  label="Mekân"
                  value={eventConfig.venue}
                />

                <DetailItem
                  icon={<MapPin className="size-5" />}
                  label="Adres"
                  value={eventConfig.address}
                />
              </div>

              {eventConfig.mapsUrl && (
                <a
                  href={eventConfig.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/65 underline decoration-[#9c2941]/70 underline-offset-4 transition hover:text-white hover:decoration-[#be3953]"
                >
                  Haritada Görüntüle
                </a>
              )}
            </div>

            <div className="border-t border-white/[0.08] pt-5">
              <p className="text-xs leading-5 text-white/35">
                Lütfen katılım durumunuzu{" "}
                <span className="text-white/65">
                  {eventConfig.responseDeadline}
                </span>{" "}
                tarihine kadar bildiriniz.
              </p>
            </div>
          </div>
        </section>

        {/* Form alanı */}
        <section className="flex items-center justify-center py-6 lg:py-8">
          <div className="w-full max-w-xl">
            <RSVPForm />
          </div>
        </section>
      </div>
    </main>
  );
}