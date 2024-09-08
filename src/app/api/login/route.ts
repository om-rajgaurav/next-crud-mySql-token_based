// route.ts

import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/authMethods";

interface LoginRequestBody {
  email: string;
  password: string;
}



export async function POST(request: Request): Promise<NextResponse> {
  const { email, password }: LoginRequestBody = await request.json();
  

  const result = await authenticateUser(email, password);

  if (result.success) {
    const response = NextResponse.json({ message: "Login successful" });
    if (result.cookieHeader) {
      response.headers.append("Set-Cookie", result.cookieHeader);
    }
    return response;
  } else {
    return NextResponse.json({ message: result.message }, { status: 401 });
  }
}
