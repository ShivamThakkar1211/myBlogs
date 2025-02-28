// pages/index.js
import styles from "./hero.module.css"
export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>My Blog</h1>
      </header>
      <main className={styles.main}>
        <article className={styles.post}>
          <h2>Sample Blog Post</h2>
          <p>This is a sample blog post content.</p>
        </article>
      </main>
    </div>
  );
}
