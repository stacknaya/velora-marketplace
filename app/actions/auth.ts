"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clearSession, createSession } from "@/lib/auth";

export async function signUp(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (name.length < 2 || !email.includes("@") || password.length < 8) {
    redirect("/sign-up?error=Please+enter+a+valid+name,+email,+and+8-character+password");
  }

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) redirect("/sign-in?error=Account+already+exists");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: { name, email, passwordHash }
  });

  await createSession(user.id);
  redirect("/host/dashboard");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    redirect("/sign-in?error=Invalid+email+or+password");
  }

  await createSession(user.id);
  redirect("/host/dashboard");
}

export async function signOut() {
  await clearSession();
  redirect("/");
}
