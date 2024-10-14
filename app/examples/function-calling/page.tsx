"use client";

import React from "react";
import styles from "../all/page.module.css"; // Adjusting the path to point to the correct CSS file
import Chat from "../../components/chat"; // Adjust import path as necessary
import FileViewer from "../../components/file-viewer"; // Adjust import path as necessary
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs"; // Ensure this import is correct

const FunctionCalling = () => {
  // Define the functionCallHandler with the correct type
  const functionCallHandler = async (call: RequiredActionFunctionToolCall): Promise<string> => {
    try {
      console.log("Handling call:", call);

      // Example: Accessing properties of the call
      if (!call || !call.id || !call.function) { // Check for necessary properties
        return "Invalid action call received."; // Ensure valid string return
      }

      // Process the call according to your business logic
      return `Processed call with ID: ${call.id}`; 

    } catch (error) {
      console.error("Error handling call:", error);
      return "An error occurred while processing the call."; // Always return a string
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
            <Chat functionCallHandler={functionCallHandler} /> {/* Pass the functionCallHandler */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default FunctionCalling;