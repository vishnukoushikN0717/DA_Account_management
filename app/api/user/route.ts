import { NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
    // Get session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    let email: string | null = null;
    if (session?.user?.email) {
      email = session.user.email;
    } else {
      // If no session, check for Authorization header
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      // Handle token-based auth if needed
      // const token = authHeader.split(' ')[1];
      // Verify token...
    }

    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized: No email found" },
        { status: 401 }
      );
    }

    // Read from db.json
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbContent = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(dbContent);

    const user = db.users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return more user details if needed
    return NextResponse.json({
      email: user.email,
      verified: user.verified,
      onboarded: user.onboarded,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      companyRole: user.companyRole,
      zipCode: user.zipCode,
      dob: user.dob
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
