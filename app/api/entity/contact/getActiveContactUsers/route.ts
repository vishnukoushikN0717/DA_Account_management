import { NextResponse } from 'next/server';

export async function GET() {
  const url = 'https://dawavpersona-hvgye7gjbmf6h6fu.eastus-01.azurewebsites.net/api/Contact/active';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: '*/*',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 