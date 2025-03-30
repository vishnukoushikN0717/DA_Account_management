import { NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

// Add type definitions for better type safety
interface RegistrationData {
  fullName: string;
  phoneNumber: string;
  companyRole: string;
  zipCode: string;
  dob: string;
}

interface User extends RegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  onboarded: boolean;
  updatedAt: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" }, // Changed 'error' to 'message' for consistency
        { status: 401 }
      );
    }

    // Type the request data
    const data = await req.json() as RegistrationData;
    const {
      fullName,
      phoneNumber,
      companyRole,
      zipCode,
      dob,
    } = data;

    // Validate all required fields first
    if (!fullName?.trim() || !phoneNumber?.trim() || !companyRole?.trim() || !zipCode?.trim() || !dob?.trim()) {
      return NextResponse.json(
        { message: "All fields are required" }, // More specific error message
        { status: 400 }
      );
    }

    // Improved name parsing
    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length < 2) {
      return NextResponse.json(
        { message: "Please provide both first and last name" },
        { status: 400 }
      );
    }
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    // Stricter phone number validation
    const phoneRegex = /^\+?[1-9]\d{9,14}$/; // International format
    if (!phoneRegex.test(phoneNumber.replace(/[\s-]/g, ''))) {
      return NextResponse.json(
        { message: "Invalid phone number format. Please use international format" },
        { status: 400 }
      );
    }

    // ZIP code validation (consider international formats)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zipCode)) {
      return NextResponse.json(
        { message: "Invalid ZIP code format. Please use XXXXX or XXXXX-XXXX format" },
        { status: 400 }
      );
    }

    // Enhanced DOB validation
    const dobDate = new Date(dob);
    const today = new Date();
    const minAge = 18; // Add minimum age requirement
    const maxAge = 100; // Add maximum age requirement
    
    if (isNaN(dobDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 }
      );
    }

    const age = today.getFullYear() - dobDate.getFullYear();
    if (age < minAge || age > maxAge) {
      return NextResponse.json(
        { message: `Age must be between ${minAge} and ${maxAge} years` },
        { status: 400 }
      );
    }

    // Safe file operations with error handling
    const dbPath = path.join(process.cwd(), 'db.json');
    let dbContent: string;
    try {
      dbContent = await fs.readFile(dbPath, 'utf-8');
    } catch (error) {
      console.error('Database read error:', error);
      return NextResponse.json(
        { message: "Database error" },
        { status: 500 }
      );
    }

    let db;
    try {
      db = JSON.parse(dbContent);
    } catch (error) {
      console.error('JSON parse error:', error);
      return NextResponse.json(
        { message: "Database corruption detected" },
        { status: 500 }
      );
    }

    const userIndex = db.users.findIndex((u: User) => u.email === session.user.email);

    if (userIndex === -1) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Update user data with type safety
    const updatedUser: User = {
      ...db.users[userIndex],
      firstName,
      lastName,
      phoneNumber: phoneNumber.replace(/[\s-]/g, ''), // Normalize phone number
      companyRole,
      zipCode,
      dob,
      onboarded: true,
      updatedAt: new Date().toISOString()
    };

    db.users[userIndex] = updatedUser;

    // Safe file write with error handling
    try {
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    } catch (error) {
      console.error('Database write error:', error);
      return NextResponse.json(
        { message: "Failed to save user data" },
        { status: 500 }
      );
    }

    // Return sanitized user data
    return NextResponse.json({
      message: "Registration successful",
      user: {
        email: session.user.email,
        fullName: `${firstName} ${lastName}`,
        phoneNumber: updatedUser.phoneNumber,
        companyRole,
        zipCode,
        dob,
        role: updatedUser.role,
        onboarded: true
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// // GET method to fetch registration status and user details
// export async function GET(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || !session.user?.email) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const dbPath = path.join(process.cwd(), 'db.json');
//     const dbContent = await fs.readFile(dbPath, 'utf-8');
//     const db = JSON.parse(dbContent);

//     const user = db.users.find((u: any) => u.email === session.user.email);

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       onboarded: user.onboarded,
//       user: {
//         email: user.email,
//         fullName: user.firstName && user.lastName 
//           ? `${user.firstName} ${user.lastName}`
//           : '',
//         phoneNumber: user.phoneNumber || '',
//         companyRole: user.companyRole || '',
//         zipCode: user.zipCode || '',
//         dob: user.dob || '',
//         role: user.role  // System role (internal/external)
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching registration status:', error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }