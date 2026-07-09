import Link from "next/link";

import {
  CalendarDays,
  LogOut,
  MessageCircle,
  UserCheck,
  UsersRound,
  UserX,
} from "lucide-react";

import { logoutAdmin } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

type AttendanceStatus = "attending" | "not_attending";

type AdminRsvp = {
  id: string;
  full_name: string;
  phone: string;
  attendance_status: AttendanceStatus;
  guest_count: number;
  note: string | null;
  created_at: string;
  updated_at: string;
};

type AdminPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

type StatusFilter = "all" | AttendanceStatus;

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getWhatsAppUrl(phone: string): string {
  const normalizedPhone = phone.replace(/\D/g, "");

  return `https://wa.me/${normalizedPhone}`;
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const isAttending = status === "attending";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        isAttending
          ? "bg-emerald-400/10 text-emerald-300"
          : "bg-red-400/10 text-red-300"
      }`}
    >
      {isAttending ? "Katılacak" : "Katılmayacak"}
    </span>
  );
}

function FilterLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
        isActive
          ? "bg-[#801a32] text-white"
          : "border border-white/10 bg-white/[0.035] text-white/45 hover:border-white/20 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await requireAdmin();

  const params = await searchParams;

  const activeFilter: StatusFilter =
    params.status === "attending" || params.status === "not_attending"
      ? params.status
      : "all";
  const sql = getDatabase();

  const result = await sql`
  SELECT
    id,
    full_name,
    phone,
    attendance_status,
    guest_count,
    note,
    created_at,
    updated_at
  FROM rsvps
  ORDER BY
    CASE
      WHEN attendance_status = 'attending'
      THEN 0
      ELSE 1
    END,
    created_at DESC
`;

  const rsvps = result as unknown as AdminRsvp[];

  const attendingRsvps = rsvps.filter(
    (rsvp) => rsvp.attendance_status === "attending",
  );

  const notAttendingRsvps = rsvps.filter(
    (rsvp) => rsvp.attendance_status === "not_attending",
  );

  const totalGuestCount = attendingRsvps.reduce(
    (total, rsvp) => total + Number(rsvp.guest_count),
    0,
  );

  const visibleRsvps =
    activeFilter === "all"
      ? rsvps
      : rsvps.filter((rsvp) => rsvp.attendance_status === activeFilter);

  const statistics = [
    {
      label: "Toplam Yanıt",
      value: rsvps.length,
      icon: UsersRound,
    },
    {
      label: "Katılacak Yanıtı",
      value: attendingRsvps.length,
      icon: UserCheck,
    },
    {
      label: "Toplam Misafir",
      value: totalGuestCount,
      icon: CalendarDays,
    },
    {
      label: "Katılamayacak",
      value: notAttendingRsvps.length,
      icon: UserX,
    },
  ];

  return (
    <main className="min-h-dvh bg-[#050505] text-white">
      <div className="pointer-events-none fixed -left-64 top-20 size-[38rem] rounded-full bg-[#651226]/15 blur-[160px]" />

      <div className="pointer-events-none fixed -right-64 bottom-0 size-[42rem] rounded-full bg-[#891a35]/15 blur-[170px]" />

      <div className="relative mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#b94058]">
              Birinci Yıl Daveti
            </p>

            <h1 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">
              Katılım Yönetimi
            </h1>

            <p className="mt-2 text-sm text-white/35">
              Davetlilerin katılım cevapları ve toplam misafir sayıları.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-xs font-medium text-white/55 transition hover:border-white/25 hover:text-white"
            >
              Davetiyeyi Aç
            </Link>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#79172d] px-5 text-xs font-medium text-white transition hover:bg-[#951d38]"
              >
                <LogOut className="size-4" />
                Çıkış
              </button>
            </form>
          </div>
        </header>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((statistic) => {
            const Icon = statistic.icon;

            return (
              <article
                key={statistic.label}
                className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.045] p-5 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-white/35">{statistic.label}</p>

                    <p className="mt-3 font-serif text-4xl">
                      {statistic.value}
                    </p>
                  </div>

                  <div className="flex size-10 items-center justify-center rounded-full bg-[#74162b]/25 text-[#ce536b]">
                    <Icon className="size-5" />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-7 overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.035]">
          <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl">Katılım Listesi</h2>

              <p className="mt-1 text-xs text-white/30">
                {visibleRsvps.length} kayıt görüntüleniyor.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterLink
                href="/admin"
                label="Tümü"
                isActive={activeFilter === "all"}
              />

              <FilterLink
                href="/admin?status=attending"
                label="Katılacak"
                isActive={activeFilter === "attending"}
              />

              <FilterLink
                href="/admin?status=not_attending"
                label="Katılmayacak"
                isActive={activeFilter === "not_attending"}
              />
            </div>
          </div>

          {visibleRsvps.length === 0 ? (
            <div className="px-5 py-20 text-center">
              <UsersRound className="mx-auto size-10 text-white/15" />

              <p className="mt-4 text-sm text-white/35">
                Bu filtreye uygun bir katılım kaydı bulunmuyor.
              </p>
            </div>
          ) : (
            <>
              {/* Masaüstü tablo */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[950px] text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-[0.16em] text-white/25">
                      <th className="px-5 py-4 font-medium">Davetli</th>

                      <th className="px-5 py-4 font-medium">Durum</th>

                      <th className="px-5 py-4 font-medium">Kişi</th>

                      <th className="px-5 py-4 font-medium">Not</th>

                      <th className="px-5 py-4 font-medium">Yanıt Tarihi</th>

                      <th className="px-5 py-4 text-right font-medium">
                        İletişim
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleRsvps.map((rsvp) => (
                      <tr
                        key={rsvp.id}
                        className="border-b border-white/[0.055] transition last:border-b-0 hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-5">
                          <p className="font-medium text-white">
                            {rsvp.full_name}
                          </p>

                          <p className="mt-1 text-xs text-white/35">
                            {rsvp.phone}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge status={rsvp.attendance_status} />
                        </td>

                        <td className="px-5 py-5 text-sm text-white/65">
                          {rsvp.attendance_status === "attending"
                            ? `${rsvp.guest_count} kişi`
                            : "—"}
                        </td>

                        <td className="max-w-xs px-5 py-5 text-sm leading-6 text-white/40">
                          {rsvp.note || "—"}
                        </td>

                        <td className="px-5 py-5 text-xs text-white/35">
                          {formatDate(rsvp.updated_at || rsvp.created_at)}
                        </td>

                        <td className="px-5 py-5 text-right">
                          <a
                            href={getWhatsAppUrl(rsvp.phone)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-white/45 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
                            aria-label={`${rsvp.full_name} ile WhatsApp üzerinden iletişime geç`}
                          >
                            <MessageCircle className="size-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobil kartlar */}
              <div className="divide-y divide-white/[0.07] md:hidden">
                {visibleRsvps.map((rsvp) => (
                  <article key={rsvp.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium">{rsvp.full_name}</h3>

                        <p className="mt-1 text-xs text-white/35">
                          {rsvp.phone}
                        </p>
                      </div>

                      <StatusBadge status={rsvp.attendance_status} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/[0.035] p-3">
                        <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                          Kişi Sayısı
                        </p>

                        <p className="mt-1 text-sm text-white/65">
                          {rsvp.attendance_status === "attending"
                            ? `${rsvp.guest_count} kişi`
                            : "—"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/[0.035] p-3">
                        <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                          Yanıt Tarihi
                        </p>

                        <p className="mt-1 text-xs leading-5 text-white/50">
                          {formatDate(rsvp.updated_at || rsvp.created_at)}
                        </p>
                      </div>
                    </div>

                    {rsvp.note && (
                      <div className="mt-3 rounded-xl bg-white/[0.035] p-3">
                        <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                          Not
                        </p>

                        <p className="mt-1 text-sm leading-6 text-white/50">
                          {rsvp.note}
                        </p>
                      </div>
                    )}

                    <a
                      href={getWhatsAppUrl(rsvp.phone)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 text-xs font-medium text-white/55 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
                    >
                      <MessageCircle className="size-4" />
                      WhatsApp’tan İletişime Geç
                    </a>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
