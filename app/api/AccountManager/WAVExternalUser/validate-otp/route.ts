import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_BASE_URL = 'https://dawavexternaluser-axgaf7g7g4djekcn.eastus-01.azurewebsites.net';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Received validation data:', data);

    const response = await fetch(`${EXTERNAL_BASE_URL}/api/WAVExternalUser/validate-otp`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      responseData = { message: responseText };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData?.message || 'Failed to validate OTP' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData || { message: 'OTP validated successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to validate OTP' },
      { status: 500 }
    );
  }
} 