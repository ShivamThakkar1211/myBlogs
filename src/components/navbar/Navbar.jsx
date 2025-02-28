"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import styles from "./nav.module.css";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className={styles.container}>
      <div className={styles.logo}>
        <Link href="/">Simple-Blog</Link>
      </div>
      <div className={styles.auth}>
      <div className={styles.username}> {user?.username && <Link href="/dashboard">{user.username}</Link>}</div>
        {session ? (
          <button onClick={() => signOut()} className={styles.button}>
            Logout
          </button>
        ) : (
          <button onClick={() => signIn()} className={styles.button}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
