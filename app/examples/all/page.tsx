"use client";

import React from "react";
import styles from "./page.module.css"; // Ensure this path is correct
import Chat from "../../components/chat"; // Adjust import path as necessary
import FileViewer from "../../components/file-viewer"; // Adjust import path as necessary
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs"; // Ensure this import is correct

const FunctionCalling = () => {
  // Define the functionCallHandler
  const functionCallHandler = async (
    call: RequiredActionFunctionToolCall
  ): Promise<string> => {
    console.log("Handling call:", call);

    // Validate the received call
    if (!call || !call.id || !call.function) {
      return "Invalid action call received."; // Ensure valid string return
    }

    // Process the call based on the ID
    switch (call.id) {
      case "user-input":
        // Assuming your API provides a valid property to get user input
        const input = call.function?.arguments
          ? JSON.parse(call.function.arguments)
          : "No input provided";
        return `Processed call with input: ${input}`;

      default:
        return "Unknown function called."; // Handles unknown calls
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.column}>
          <FileViewer /> {/* FileViewer component to display files */}
        </div>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat functionCallHandler={functionCallHandler} />{" "}
            {/* Pass the functionCallHandler */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default FunctionCalling;
