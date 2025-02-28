"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import styles from './verify.module.css'

const schema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters"),
});

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/verifi-code", {
        username: params.username,
        code: data.code,
      });

      console.log(res.data);
      router.push("/dashboard");
    } catch (error) {
      console.error("Verification failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Verify Your Account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Enter the code we sent you:</label>
        <input
          type="text"
          placeholder="Verification Code"
          {...register("code")}
          className={styles.input}
        />
        {errors.code && <p className={styles.error}>{errors.code.message}</p>}

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Code"}
        </button>
      </form>
    </div>
  );
};

export default Page;
