import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [translateInput, setTranslateInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ translate: translateInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setTranslateInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>English to French Translation</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>English to French Translation</h3>
        <form onSubmit={onSubmit}>
          <textarea
            className="input"
            name="translate"
            placeholder="Enter text"
            value={translateInput}
            onChange={(e) => setTranslateInput(e.target.value)}
          />
          <input type="submit" value="Translate" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
