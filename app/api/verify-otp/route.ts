import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  // Fetch mock data from json-server
  const res = await fetch("http://localhost:5000/users");
  const users = await res.json();

  const user = users.find((u: any) => u.email === email);

  if (user && user.otp === otp) {
    return NextResponse.json({ message: "OTP verified successfully" });
  } else {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }
}
