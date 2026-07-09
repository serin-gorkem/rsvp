"use server";

import { redirect } from "next/navigation";

import {
  createAdminSession,
  destroyAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export type AdminLoginState = {
  success: boolean;
  message?: string;
};

export async function loginAdmin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const password = String(
    formData.get("password") ?? "",
  );

  if (!password) {
    return {
      success: false,
      message:
        "Lütfen admin şifresini girin.",
    };
  }

  try {
    const isPasswordCorrect =
      verifyAdminPassword(password);

    if (!isPasswordCorrect) {
      return {
        success: false,
        message: "Admin şifresi hatalı.",
      };
    }

    await createAdminSession();
  } catch (error) {
    console.error(
      "Admin giriş hatası:",
      error,
    );

    return {
      success: false,
      message:
        "Admin girişi sırasında bir hata oluştu.",
    };
  }

  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await destroyAdminSession();

  redirect("/admin/login");
}