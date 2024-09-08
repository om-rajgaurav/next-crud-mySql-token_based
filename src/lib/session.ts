// lib/session.ts
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export const setTokenCookie = (res: NextApiResponse, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  };

  res.setHeader("Set-Cookie", cookie.serialize("token", token, cookieOptions));
};

export const removeTokenCookie = (res: NextApiResponse) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: -1,
      path: "/",
    })
  );
};


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export async function getUserIdFromRequest(
  request: NextRequest
): Promise<number | null> {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.user_id;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}


