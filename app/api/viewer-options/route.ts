import { NextRequest, NextResponse } from "next/server";
import type { AuthState, DisplayMappingKey } from "@/types/catalog";

function isValidAuthState(value: unknown): value is AuthState {
  return value === "logged_in" || value === "logged_out";
}

function isValidMappingKey(value: unknown): value is DisplayMappingKey {
  return value === "price_first" || value === "specs_first";
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = NextResponse.json({ ok: true });

  if (isValidAuthState(body?.authState)) {
    response.cookies.set("authState", body.authState, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  if (isValidMappingKey(body?.mappingKey)) {
    response.cookies.set("mappingKey", body.mappingKey, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}