import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/authMethods';

export async function POST(request: Request) {
  const userData = await request.json();

  const result = await registerUser(userData);

  if (result.success) {
    return NextResponse.json({ message: result.message }, { status: 201 });
  } else {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }
}

