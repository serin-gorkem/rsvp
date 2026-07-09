"use server";

import { redirect } from "next/navigation";

import { sql } from "@/lib/db";
import { rsvpSchema } from "@/lib/validations";

export type RSVPActionState = {
  success: boolean;
  message?: string;

  errors?: {
    fullName?: string[];
    phone?: string[];
    attendanceStatus?: string[];
    guestCount?: string[];
    note?: string[];
  };
};

function normalizeTurkishPhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");

  // 0090 5xx...
  if (digits.startsWith("0090")) {
    digits = digits.slice(2);
  }

  // 0 5xx...
  if (digits.startsWith("0") && digits.length === 11) {
    return `+90${digits.slice(1)}`;
  }

  // 5xx...
  if (digits.length === 10) {
    return `+90${digits}`;
  }

  // 90 5xx...
  if (digits.startsWith("90") && digits.length === 12) {
    return `+${digits}`;
  }

  return `+${digits}`;
}

export async function submitRsvp(
  _previousState: RSVPActionState,
  formData: FormData,
): Promise<RSVPActionState> {
  const attendanceStatus = String(
    formData.get("attendanceStatus") ?? "",
  );

  const guestCount =
    attendanceStatus === "attending"
      ? formData.get("guestCount")
      : 0;

  const validationResult = rsvpSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: normalizeTurkishPhone(
      String(formData.get("phone") ?? ""),
    ),
    attendanceStatus,
    guestCount,
    note: formData.get("note") || undefined,
  });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Lütfen formdaki hataları kontrol edin.",
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const {
    fullName,
    phone,
    attendanceStatus: validatedStatus,
    guestCount: validatedGuestCount,
    note,
  } = validationResult.data;

  try {
    await sql`
      INSERT INTO rsvps (
        full_name,
        phone,
        attendance_status,
        guest_count,
        note
      )
      VALUES (
        ${fullName},
        ${phone},
        ${validatedStatus},
        ${validatedGuestCount},
        ${note || null}
      )
      ON CONFLICT (phone)
      DO UPDATE SET
        full_name = EXCLUDED.full_name,
        attendance_status = EXCLUDED.attendance_status,
        guest_count = EXCLUDED.guest_count,
        note = EXCLUDED.note,
        updated_at = NOW()
    `;
  } catch (error) {
    console.error("RSVP kayıt hatası:", error);

    return {
      success: false,
      message:
        "Katılım bilginiz kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }

  redirect(
    validatedStatus === "attending"
      ? "/tesekkurler?katilim=evet"
      : "/tesekkurler?katilim=hayir",
  );
}