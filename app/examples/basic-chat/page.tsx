"use client";

import React from "react";
import styles from "./page.module.css"; // Use simple styles for demonstration purposes
import Chat from "../../components/chat"; // Adjust import path as necessary
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs"; // Ensure this import is correct

const Home = () => {
  // Define the functionCallHandler
  const functionCallHandler = async (call: RequiredActionFunctionToolCall): Promise<string> => {
    console.log("Handling call:", call);

    // Validate the received call
    if (!call || !call.id || !call.function) {
      return "Invalid action call received."; // Ensure valid string return
    }

    // Example logic for processing the call
    // Adjust as necessary based on your application's requirements
    return `Processed call with ID: ${call.id}`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Chat functionCallHandler={functionCallHandler} /> {/* Pass the functionCallHandler */}
      </div>
    </main>
  );
};

export default Home;
