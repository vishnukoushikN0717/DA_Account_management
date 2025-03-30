import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_BASE_URL = 'https://dawavexternaluser-axgaf7g7g4djekcn.eastus-01.azurewebsites.net';

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${EXTERNAL_BASE_URL}/api/WAVExternalUser`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// For other methods (POST, PUT) specific to external users
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(`${EXTERNAL_BASE_URL}/api/WAVExternalUser`, {
      method: 'PUT',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 }
    );
  }
}

// Add POST method handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${EXTERNAL_BASE_URL}/api/WAVExternalUser`, {
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
        { error: 'Failed to create external user' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create external user' },
      { status: 500 }
    );
  }
} 