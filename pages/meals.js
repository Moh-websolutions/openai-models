import React from "react";
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [gender, setGender] = useState("man");
  const [age, setAge] = useState(25);
  const [priceMin, setPriceMin] = useState(25);
  const [priceMax, setPriceMax] = useState(100);
  const [weight, setWeight] = useState(175);
  const [fatLose, setFatLose] = useState(5);
  const [foods, setFoods] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/generate-meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceMin, priceMax, gender, age, weight, fatLose, foods }),
      });
      const data = await response.json();
      setResult(data.result.replaceAll("\n", "<br />"));
    } catch (e) {
      alert("Failed to generate meals ideas. Try later");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>Meal plan generate</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>

        <form onSubmit={onSubmit}>
          <div className={styles.textcenter}><h3> 🍽️ Generate a weekly meal plan</h3></div>

          <label>Gender</label>
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="man">Man</option>
            <option value="woman">Woman</option>
          </select>

          <label>Age</label>
          <input
            type="number"
            min={1}
            max={99}
            name="age"
            placeholder="Enter the age"
            value={age}
            onChange={(e) => setAge(Number.parseInt(e.target.value))}
          />

          <label>Body weight</label>
          <input
            type="number"
            name="weight"
            placeholder="Enter body weight in pounds"
            value={weight}
            onChange={(e) => setWeight(Number.parseInt(e.target.value))}
          />

          <label>How many pounds do you want to lose per week <small>(maximum of 5 pounds per week)</small>?</label>
          <input
            type="number"
            min={0}
            max={5}
            name="fatLose"
            placeholder="Enter the number of pounds to lose per week"
            value={fatLose}
            onChange={(e) => setFatLose(Number.parseInt(e.target.value))}
          />

          <label>Price from</label>
          <input
            type="number"
            min={1}
            name="priceMin"
            placeholder="Enter the minimum price"
            value={priceMin}
            onChange={(e) => setPriceMin(Number.parseInt(e.target.value))}
          />

          <label>Price to</label>
          <input
            type="number"
            min={1}
            name="priceMax"
            placeholder="Enter the maximum price"
            value={priceMax}
            onChange={(e) => setPriceMax(Number.parseInt(e.target.value))}
          />

          <label>Foods you like to eat </label>
          <input
            type="text"
            name="foods"
            placeholder="Broccoli, chicken, Peanut butter etc. "
            value={foods}
            onChange={(e) => setFoods(e.target.value)}
          />
          <input type="submit" value="Generate meal plan" />
        </form>

        {loading && (
          <div>
            <h3>Looking for the best meal plan ideas 🍽️ 💡</h3>
            {/* <img src="/loading.gif" className={styles.loading} /> */}
          </div>
        )}
        {result && (
          <div
            className={styles.result}
            dangerouslySetInnerHTML={{ __html: result }}
          />
        )}
      </main>
    </div>
  );
}