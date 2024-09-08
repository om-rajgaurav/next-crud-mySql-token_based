import cookie from "cookie";
import { NextResponse } from "next/server";
import { logoutUser } from "@/lib/authMethods";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Parse cookies from the request header
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    const result = await logoutUser(cookies);

    if (result.success) {
      const response = NextResponse.json({ message: result.message });
      if (result.cookieHeader) {
        response.headers.append("Set-Cookie", result.cookieHeader);
      }
      return response;
    } else {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
