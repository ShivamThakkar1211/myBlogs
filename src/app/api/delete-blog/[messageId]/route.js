import dbConnect from "@/helpers/dbConnect";
import User from "@/models/User";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { messageId } = params; // ✅ Correct way to get the messageId in App Router

    console.log("Deleting message with ID:", messageId);

    if (!ObjectId.isValid(messageId)) {
      return new Response(JSON.stringify({ success: false, message: "Invalid message ID" }), {
        status: 400,
      });
    }

    // ✅ Find the user that owns the message and remove it
    const updatedUser = await User.findOneAndUpdate(
      { "blogMessages._id": messageId },
      { $pull: { blogMessages: { _id: messageId } } },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ success: false, message: "Message not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Message deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), {
      status: 500,
    });
  }
}
