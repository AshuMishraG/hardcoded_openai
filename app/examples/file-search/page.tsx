"use client";

import React from "react";
import styles from "../shared/page.module.css"; // Ensure this path is correct
import Chat from "../../components/chat"; // Adjust import path as necessary
import FileViewer from "../../components/file-viewer"; // Adjust import path as necessary
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs"; // Ensure this import is correct

const FileSearchPage = () => {
  // Define the functionCallHandler
  const functionCallHandler = async (call: RequiredActionFunctionToolCall): Promise<string> => {
    console.log("Handling call:", call);
    
    // Validate the received call
    if (!call || !call.id || !call.function) {
      return "Invalid action call received."; // Ensure valid string return
    }

    // Process the call based on the function specified
    return `Processed call with ID: ${call.id}`; // Modify this according to your logic
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

export default FileSearchPage;
