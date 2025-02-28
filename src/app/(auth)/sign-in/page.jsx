"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import styles from './signIn.module.css'

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        console.error("Authentication failed:", result.error);
      }

      if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Welcome Back to <span className={styles.brand}>Freedom to speech</span>
        </h1>
        <p className={styles.subtitle}>Sign in to continue your secret conversations</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Identifier Field */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email/Username</label>
            <input
              {...register("identifier")}
              className={styles.input}
              autoComplete="username"
            />
            {errors.identifier && (
              <p className={styles.error}>{errors.identifier.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              {...register("password")}
              type="password"
              className={styles.input}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className={styles.loader} />
                Please wait
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className={styles.linkContainer}>
          <p>
            Not a member yet?{" "}
            <Link href="/sign-up" className={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
