import dbConnect from "@/helpers/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // Fetch users along with their blog messages
    const users = await User.find({}, "username blogMessages").lean();

    // Flatten all messages and include username for each message
    const allMessages = users.flatMap(user =>
      (user.blogMessages || []).map(message => ({
        ...message,
        username: user.username, // Attach username
      }))
    );

    // Sort messages by timestamp (newest first)
    const sortedMessages = allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(JSON.stringify({ success: true, messages: sortedMessages }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching blog messages:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
