import { NextResponse } from "next/server";
import dbConnect from "@/helpers/dbConnect";
import User from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req) {
  await dbConnect();

  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // Validate username using Zod
    const result = UserNameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username",
          errors: usernameErrors,
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    // Check if the username exists and is verified
    const existingVerifiedUser = await User.findOne({ username, isVerified: true });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
