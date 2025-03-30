import { NextRequest, NextResponse } from 'next/server';

// This route handler will proxy the image upload to the external API
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id;

    if (!userId) {
        return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
        );
    }

    try {
        // Get the form data from the request
        const formData = await req.formData();

        // Forward the request to the external API
        const uploadUrl = `https://dawavadmin-djb0f9atf8e6cwgx.eastus-01.azurewebsites.net/api/ImageUploadInternal/upload/${userId}`;

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('External API Error:', errorText);

            return NextResponse.json(
                { error: 'Failed to upload image' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Image Upload API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process image upload' },
            { status: 500 }
        );
    }
}