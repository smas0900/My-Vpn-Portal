
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { password } = await req.json();

  if (password !== process.env.LOGIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Sign JWT
  const token = jwt.sign({ user: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Send cookie
  const res = NextResponse.json({ success: true });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res;
}
