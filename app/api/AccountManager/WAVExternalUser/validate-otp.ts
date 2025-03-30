import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_BASE_URL = 'https://dawavexternaluser-axgaf7g7g4djekcn.eastus-01.azurewebsites.net';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const response = await fetch(`${EXTERNAL_BASE_URL}/api/WAVExternalUser/validate-otp`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to validate OTP' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to validate OTP' },
      { status: 500 }
    );
  }
} 