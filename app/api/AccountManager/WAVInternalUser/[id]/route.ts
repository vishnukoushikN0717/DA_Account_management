// app/api/AccountManager/WAVInternalUser/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_BASE_URL = 'https://dawavinternaluser-btgsaphegvahbug9.eastus-01.azurewebsites.net';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        console.log(`Fetching user with ID: ${id}`);

        const response = await fetch(`${INTERNAL_BASE_URL}/api/WAVInternalUser/${id}`, {
            method: 'GET',
            headers: {
                'accept': '*/*',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching user: ${errorText}`);
            return NextResponse.json(
                { error: `Failed to fetch user: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user data' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        console.log(`Updating user with ID: ${id}`);

        const body = await req.json();
        console.log("Update request body:", body);

        // Make sure profileImageUrl is included in the request if provided
        if (body.profileImageUrl) {
            console.log("Profile image URL in update request:", body.profileImageUrl);
        }

        // Ensure ID is set in the body
        const updatedBody = {
            ...body,
            id: id
        };

        const response = await fetch(`${INTERNAL_BASE_URL}/api/WAVInternalUser/${id}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBody),
        });

        console.log(`External API response status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error updating user: ${errorText}`);
            return NextResponse.json(
                { error: `Failed to update user: ${response.statusText}` },
                { status: response.status }
            );
        }

        // Try to get the response data
        let data;
        try {
            data = await response.json();
            console.log("External API response:", data);
        } catch (e) {
            console.log("Response could not be parsed as JSON");
            const text = await response.text();
            console.log("Raw response:", text);
            data = { message: "User updated successfully" };
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to update user data' },
            { status: 500 }
        );
    }
}