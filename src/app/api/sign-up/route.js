import { NextResponse } from "next/server";
import dbConnect from "@/helpers/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();

    const existingUserVerifyByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifyByUsername) {
      return NextResponse.json(
        { success: false, error: "Username is already taken" },
        { status: 400 }
      );
    }

    const existingUserVerifyByEmail = await User.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserVerifyByEmail) {
      if (existingUserVerifyByEmail.isVerified) {
        return NextResponse.json(
          { success: false, error: "Email is already registered" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserVerifyByEmail.password = hashedPassword;
        existingUserVerifyByEmail.verifyCode = verifyCode;
        existingUserVerifyByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await existingUserVerifyByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
      });
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);

    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, error: emailResponse.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
