import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Fetch mock data from json-server
    const res = await fetch("http://localhost:5000/users");
    const users = await res.json();

    const user = users.find((u: any) => u.email === email);

    if (user) {
      // In a real application, you would:
      // 1. Generate a new OTP
      // 2. Update it in the database
      // 3. Send it via email
      // For now, we'll just return the existing OTP from the mock data
      return NextResponse.json({ 
        message: "OTP sent successfully", 
        otp: user.otp 
      });
    } else {
      return NextResponse.json(
        { message: "User not found" }, 
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { message: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
} 