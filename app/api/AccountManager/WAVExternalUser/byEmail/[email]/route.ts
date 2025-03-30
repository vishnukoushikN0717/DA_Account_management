import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_BASE_URL = 'https://dawavexternaluser-axgaf7g7g4djekcn.eastus-01.azurewebsites.net';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ email: string }> }
): Promise<NextResponse> {
  try {
    const { email } = await context.params;
    console.log('Searching for user with email:', email);

    const response = await fetch(
      `${EXTERNAL_BASE_URL}/api/WAVExternalUser/byEmail/${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      }
    );

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
        { error: responseData?.message || 'Failed to find user' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData || { message: 'User found successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to find user' },
      { status: 500 }
    );
  }
} 