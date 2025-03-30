import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { onboarded } = await req.json();

  // Fetch mock data from json-server
  const res = await fetch("http://localhost:5000/users");
  const users = await res.json();

  const user = users.find((u: any) => u.email === onboarded);

  if (user) {
    return NextResponse.json({ message: "onboarding status", status: user.onboarded });
  } else {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }
}