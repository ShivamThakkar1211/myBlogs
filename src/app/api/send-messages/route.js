import User from "@/models/User";
import dbConnect from "@/helpers/dbConnect";

export async function POST(request) {
  await dbConnect();

  try {
    // Ensure the request is in JSON format
    const body = await request.json();
    console.log("Received body:", body);

    const { username, content } = body;

    if (!username || !content) {
      return new Response(
        JSON.stringify({ message: "Username and content are required", success: false }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await User.findOne({ username }).exec();

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found", success: false }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    // Push the new message to the user's messages array
    user.blogMessages.push(newMessage);
    await user.save();

    return new Response(
      JSON.stringify({ message: "Message sent successfully", success: true }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error", success: false }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
