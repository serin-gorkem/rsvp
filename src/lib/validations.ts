import { z } from "zod";

export const rsvpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Lütfen adınızı ve soyadınızı girin.")
      .max(150, "Ad soyad çok uzun."),

    phone: z
      .string()
      .trim()
      .regex(
        /^\+90\d{10}$/,
        "Geçerli bir Türkiye telefon numarası girin.",
      ),

    attendanceStatus: z.enum(
      ["attending", "not_attending"],
      {
        message: "Lütfen katılım durumunuzu seçin.",
      },
    ),

    guestCount: z.coerce
      .number()
      .int()
      .min(0, "Kişi sayısı geçersiz.")
      .max(10, "En fazla 10 kişi seçebilirsiniz."),

    note: z
      .string()
      .trim()
      .max(500, "Not en fazla 500 karakter olabilir.")
      .optional(),
  })
  .superRefine((data, context) => {
    if (
      data.attendanceStatus === "attending" &&
      data.guestCount < 1
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["guestCount"],
        message: "Katılacak kişi sayısı en az 1 olmalıdır.",
      });
    }

    if (
      data.attendanceStatus === "not_attending" &&
      data.guestCount !== 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["guestCount"],
        message: "Katılmayacak kişiler için kişi sayısı 0 olmalıdır.",
      });
    }
  });

export type RSVPFormData = z.infer<typeof rsvpSchema>;