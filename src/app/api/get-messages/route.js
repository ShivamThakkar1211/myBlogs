import dbConnect from "@/helpers/dbConnect";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?._id) {
      return new Response(JSON.stringify({ success: false, message: "Not authenticated" }), {
        status: 401,
      });
    }

    console.log("Authenticated User ID:", session.user._id);

    const userId = new mongoose.Types.ObjectId(session.user._id);
    const user = await User.findById(userId).select("blogMessages").lean();

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), {
        status: 404,
      });
    }

    console.log("Fetched Blog Messages:", user.blogMessages);

    return new Response(JSON.stringify({ success: true, messages: user.blogMessages }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), {
      status: 500,
    });
  }
}
