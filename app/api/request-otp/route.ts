import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  // Fetch mock data from json-server
  const res = await fetch("http://localhost:5000/users");
  const users = await res.json();

  const user = users.find((u: any) => u.email === email);

  if (user) {
    return NextResponse.json({ message: "OTP sent successfully", otp: user.otp });
  } else {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }
}
