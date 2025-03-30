import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_BASE_URL = 'https://dawavexternaluser-axgaf7g7g4djekcn.eastus-01.azurewebsites.net';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    console.log('🔍 [DEBUG] Route hit:', request.url);

    const response = await fetch(`${EXTERNAL_BASE_URL}/api/WAVExternalUser/${id}`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const response = await fetch(`${EXTERNAL_BASE_URL}/api/WAVExternalUser/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete external user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(`${EXTERNAL_BASE_URL}/api/WAVExternalUser/${id}`, {
      method: 'PATCH',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to update external user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const data = await request.json();
    console.log('Updating user:', id, 'with data:', data);

    const response = await fetch(`${EXTERNAL_BASE_URL}/api/WAVExternalUser/${id}`, {
      method: 'PUT',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : { message: 'Profile updated successfully' };
    } catch (e) {
      console.error('Failed to parse response:', e);
      responseData = { message: responseText || 'Profile updated successfully' };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData?.message || 'Failed to update profile' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}