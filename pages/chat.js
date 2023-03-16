import Head from "next/head";
import { useState, useRef } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [chatInput, setChatInput] = useState("");
  const [result, setResult] = useState("");
  const resultRef = useRef(null);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat: chatInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult((prevResult) => prevResult ? prevResult + "\n" + data.result : data.result);
      setChatInput("");
      scrollToBottom();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function scrollToBottom() {
    resultRef.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div>
      <Head>
        <title>AI assistant</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3> </h3>
        <p
          id="generated-meals"
          className={styles.result}
          dangerouslySetInnerHTML={{ __html: result }}
          ref={resultRef}
        />
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="input"
            name="chat"
            placeholder="Enter text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <input type="submit" value="submit" />
        </form>
      </main>
    </div>
  );
}
