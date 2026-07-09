import Link from "next/link";
import {
  CheckCircle2,
  Heart,
} from "lucide-react";

type ThankYouPageProps = {
  searchParams: Promise<{
    katilim?: string;
  }>;
};

export default async function ThankYouPage({
  searchParams,
}: ThankYouPageProps) {
  const params = await searchParams;

  const isAttending =
    params.katilim === "evet";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e9e2d8] px-4 py-10">
      <section className="w-full max-w-xl rounded-[2.5rem] border border-black/10 bg-white/80 p-8 text-center shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-neutral-950 text-white">
          {isAttending ? (
            <Heart className="size-7" />
          ) : (
            <CheckCircle2 className="size-7" />
          )}
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Yanıtınız Kaydedildi
        </p>

        <h1 className="mt-4 font-serif text-4xl tracking-tight text-neutral-950 sm:text-5xl">
          {isAttending
            ? "Sizi aramızda görmek için sabırsızlanıyoruz."
            : "Katılım durumunuzu bildirdiğiniz için teşekkür ederiz."}
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-neutral-600">
          Telefon numaranızı kullanarak formu tekrar
          doldurursanız önceki yanıtınız otomatik olarak
          güncellenecektir.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-neutral-950 px-7 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Davetiyeye Dön
        </Link>
      </section>
    </main>
  );
}