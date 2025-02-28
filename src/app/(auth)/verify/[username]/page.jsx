"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; // ✅ Use lowercase 'z' for consistency
import axios from "axios";

// Define the schema for form validation
const schema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters"),
});

const Page = () => {
  const router = useRouter();
  const params = useParams(); // Get the username from the URL params
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // Track form submission state
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Send the verification code to the API
      const res = await axios.post("/api/verifi-code", {
        username: params.username, // Pass the username from URL params
        code: data.code, // Pass the code from the form
      });

      console.log(res.data); // Log the response for debugging

      // Redirect to the dashboard if verification is successful
      router.push("/dashboard");
    } catch (error) {
      console.error("Verification failed:", error.response?.data?.message || error.message);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div>
      <h1>Verify Your Account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Enter the code we sent you:</label>
        <input
          type="text"
          placeholder="Verification Code"
          {...register("code")}
        />
        {errors.code && <p style={{ color: "red" }}>{errors.code.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Code"}
        </button>
      </form>
    </div>
  );
};

export default Page;