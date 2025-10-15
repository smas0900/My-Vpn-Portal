import { NextResponse } from "next/server";

export async function POST(req) {
  const response = NextResponse.redirect(new URL("/", req.url));
  
  // Clear the auth token cookie
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0) // Set expiry to past date
  });
  
  return response;
}