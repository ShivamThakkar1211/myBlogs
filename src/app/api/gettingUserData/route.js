import dbConnect from "@/helpers/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
      await dbConnect();
      const { username, blog } = await req.json();
  
      if (!username || !blog) {
        console.error('Validation Error: Missing fields', { username, blog });
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
      }
  
      console.log('Received data:', { username, blog });
  
      let user = await User.findOne({ username });
  
      if (!user) {
        console.log('Creating new user...');
        user = new User({ username, blogs: [blog] });
      } else {
        console.log('User found. Adding blog:', blog);
        user.blogs.push(blog);
      }
  
      console.log('Saving user:', user);
      await user.save(); // Error happens here
  
      return NextResponse.json({ message: 'Blog submitted successfully' }, { status: 201 });
  
    } catch (error) {
      console.error('Validation Error:', error.errors);
      return NextResponse.json({ error: 'Internal Server Error', details: error.errors }, { status: 500 });
    }
  }
  