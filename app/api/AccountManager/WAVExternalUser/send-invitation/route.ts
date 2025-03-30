import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_BASE_URL = 'https://dawavexternaluser-axgaf7g7g4djekcn.eastus-01.azurewebsites.net';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${EXTERNAL_BASE_URL}/api/WAVExternalUser/send-invitation`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('API Error Response:', text);
      return NextResponse.json(
        { error: 'Failed to send invitation' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
} 