// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import styles from "./chat.module.css";
// import { AssistantStream } from "openai/lib/AssistantStream";
// import Markdown from "react-markdown";
// // @ts-expect-error - no types for this yet
// import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
// import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

// type MessageProps = {
//   role: "user" | "assistant" | "code";
//   text: string;
// };

// const UserMessage = ({ text }: { text: string }) => {
//   return <div className={styles.userMessage}>{text}</div>;
// };

// const AssistantMessage = ({ text }: { text: string }) => {
//   return (
//     <div className={styles.assistantMessage}>
//       <Markdown>{text}</Markdown>
//     </div>
//   );
// };

// const CodeMessage = ({ text }: { text: string }) => {
//   return (
//     <div className={styles.codeMessage}>
//       {text.split("\n").map((line, index) => (
//         <div key={index}>
//           <span>{`${index + 1}. `}</span>
//           {line}
//         </div>
//       ))}
//     </div>
//   );
// };

// const Message = ({ role, text }: MessageProps) => {
//   switch (role) {
//     case "user":
//       return <UserMessage text={text} />;
//     case "assistant":
//       return <AssistantMessage text={text} />;
//     case "code":
//       return <CodeMessage text={text} />;
//     default:
//       return null;
//   }
// };

// type ChatProps = {
//   functionCallHandler?: (
//     toolCall: RequiredActionFunctionToolCall
//   ) => Promise<string>;
// };

// const Chat = ({
//   functionCallHandler = () => Promise.resolve(""), // default to return empty string
// }: ChatProps) => {
//   const [userInput, setUserInput] = useState("");
//   const [messages, setMessages] = useState<MessageProps[]>([]);
//   const [inputDisabled, setInputDisabled] = useState(false);
//   const [threadId, setThreadId] = useState("");

//   // automatically scroll to bottom of chat
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // create a new threadID when chat component is created
//   useEffect(() => {
//     const createThread = async () => {
//       const res = await fetch(`/api/assistants/threads`, {
//         method: "POST",
//       });
//       const data = await res.json();
//       setThreadId(data.threadId);
//     };
//     createThread();
//   }, []);

//   const sendMessage = async (text: string) => {
//     // Send a POST request to the server to submit a message
//     const response = await fetch(
//       `/api/assistants/threads/${threadId}/messages`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json", // Ensure to set the correct content type
//         },
//         body: JSON.stringify({
//           content: text,
//         }),
//       }
//     );

//     // Check if the response is OK (status in the range 200-299)
//     if (!response.ok) {
//       console.error("Error sending message:", response.statusText);
//       return; // Exit the function in case of an error
//     }

//     // Ensure response.body is not null before creating a readable stream
//     if (response.body === null) {
//       console.error("Response body is null. Unable to create a readable stream.");
//       return; // Handle accordingly, e.g., return or throw an error
//     }

//     // Create a stream from the response body and handle it
//     const stream = AssistantStream.fromReadableStream(response.body);
//     handleReadableStream(stream);
//   };

//   const submitActionResult = async (runId: string, toolCallOutputs: any) => {
//     const response = await fetch(
//       `/api/assistants/threads/${threadId}/actions`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           runId: runId,
//           toolCallOutputs: toolCallOutputs,
//         }),
//       }
//     );

//     if (!response.ok) {
//       console.error("Error submitting action result:", response.statusText);
//       return;
//     }

//     const stream = AssistantStream.fromReadableStream(response.body as ReadableStream<Uint8Array>);
//     handleReadableStream(stream);
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault(); // Prevent form submission
//     if (!userInput.trim()) return; // Check that input is not empty

//     sendMessage(userInput); // Send the user input

//     // Update the messages state
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { role: "user", text: userInput }, // Append new user message
//     ]);

//     setUserInput(""); // Clear the input field
//     setInputDisabled(true); // Disable the input field until the message is processed
//     scrollToBottom(); // Scroll to the bottom of the chat
//   };

//   /* Stream Event Handlers */

//   // textCreated - create new assistant message
//   const handleTextCreated = () => {
//     appendMessage("assistant", "");
//   };

//   // textDelta - append text to last assistant message
//   const handleTextDelta = (delta: { value?: string; annotations?: any }) => {
//     if (delta.value != null) {
//       appendToLastMessage(delta.value);
//     }
//     if (delta.annotations != null) {
//       annotateLastMessage(delta.annotations);
//     }
//   };

//   // imageFileDone - show image in chat
//   const handleImageFileDone = (image: { file_id: string }) => {
//     appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
//   };

//   // toolCallCreated - log new tool call
//   const toolCallCreated = (toolCall: { type: string }) => {
//     if (toolCall.type !== "code_interpreter") return;
//     appendMessage("code", "");
//   };

//   // toolCallDelta - log delta and snapshot for the tool call
//   const toolCallDelta = (delta: { type: string; code_interpreter?: { input?: string } }, snapshot: any) => {
//     if (delta.type !== "code_interpreter") return;
//     if (!delta.code_interpreter?.input) return;
//     appendToLastMessage(delta.code_interpreter.input);
//   };

//   // handleRequiresAction - handle function call
//   const handleRequiresAction = async (
//     event: AssistantStreamEvent.ThreadRunRequiresAction
//   ) => {
//     const runId = event.data.id;
//     const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;

//     // loop over tool calls and call function handler
//     const toolCallOutputs = await Promise.all(
//       toolCalls.map(async (toolCall) => {
//         const result = await functionCallHandler(toolCall);
//         return { output: result, tool_call_id: toolCall.id };
//       })
//     );
//     setInputDisabled(true);
//     submitActionResult(runId, toolCallOutputs);
//   };

//   // handleRunCompleted - re-enable the input form
//   const handleRunCompleted = () => {
//     setInputDisabled(false);
//   };

//   const handleReadableStream = (stream: AssistantStream) => {
//     // messages
//     stream.on("textCreated", handleTextCreated);
//     stream.on("textDelta", handleTextDelta);

//     // image
//     stream.on("imageFileDone", handleImageFileDone);

//     // code interpreter
//     stream.on("toolCallCreated", toolCallCreated);
//     stream.on("toolCallDelta", toolCallDelta);

//     // events without helpers yet (e.g. requires_action and run.done)
//     stream.on("event", (event) => {
//       if (event.event === "thread.run.requires_action") handleRequiresAction(event);
//       if (event.event === "thread.run.completed") handleRunCompleted();
//     });
//   };

//   /*
//     =======================
//     === Utility Helpers ===
//     =======================
//   */

//   const appendToLastMessage = (text: string) => {
//     setMessages((prevMessages) => {
//       if (prevMessages.length === 0) return prevMessages; // Check to prevent errors
//       const lastMessage = prevMessages[prevMessages.length - 1]; // Get the last message
//       const updatedLastMessage = {
//         ...lastMessage,
//         text: lastMessage.text + text, // Correctly concatenate the text
//       };
//       return [...prevMessages.slice(0, -1), updatedLastMessage]; // Return the updated messages array
//     });
//   };

//   const appendMessage = (role: MessageProps['role'], text: string) => {
//     setMessages((prevMessages) => [...prevMessages, { role, text }]);
//   };

//   const annotateLastMessage = (annotations: any) => {
//     setMessages((prevMessages) => {
//       const lastMessage = prevMessages[prevMessages.length - 1];
//       const updatedLastMessage = {
//         ...lastMessage,
//       };

//       annotations.forEach((annotation: { type: string; text: string; file_path?: { file_id: string } }) => {
//         if (annotation.type === "file_path" && annotation.file_path) { // Check if annotation.file_path is defined
//           updatedLastMessage.text = updatedLastMessage.text.replaceAll(
//             annotation.text,
//             `/api/files/${annotation.file_path.file_id}` // Safe access
//           );
//         }
//       });

//       return [...prevMessages.slice(0, -1), updatedLastMessage];
//     });
//   };

//   return (
//     <div className={styles.chatContainer}>
//       <div className={styles.messages}>
//         {messages.map((msg, index) => (
//           <Message key={index} role={msg.role} text={msg.text} />
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <form onSubmit={handleSubmit} className={`${styles.inputForm} ${styles.clearfix}`}>
//         <input
//           type="text"
//           className={styles.input}
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           placeholder="Enter your question"
//         />
//         <button type="submit" className={styles.button} disabled={inputDisabled}>
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Chat;

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import styles from "./chat.module.css"; // Adjust path as necessary
// import { AssistantStream } from "openai/lib/AssistantStream";
// import Markdown from "react-markdown";
// // @ts-expect-error - no types for this yet
// import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
// import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

// type MessageProps = {
//   role: "user" | "assistant" | "code";
//   text: string;
// };

// const UserMessage = ({ text }: { text: string }) => {
//   return <div className={styles.userMessage}>{text}</div>;
// };

// const AssistantMessage = ({ text }: { text: string }) => {
//   return (
//     <div className={styles.assistantMessage}>
//       <Markdown>{text}</Markdown>
//     </div>
//   );
// };

// const CodeMessage = ({ text }: { text: string }) => {
//   return (
//     <div className={styles.codeMessage}>
//       {text.split("\n").map((line, index) => (
//         <div key={index}>
//           <span>{`${index + 1}. `}</span>
//           {line}
//         </div>
//       ))}
//     </div>
//   );
// };

// const Message = ({ role, text }: MessageProps) => {
//   switch (role) {
//     case "user":
//       return <UserMessage text={text} />;
//     case "assistant":
//       return <AssistantMessage text={text} />;
//     case "code":
//       return <CodeMessage text={text} />;
//     default:
//       return null;
//   }
// };

// type ChatProps = {
//   functionCallHandler: (
//     toolCall: RequiredActionFunctionToolCall
//   ) => Promise<string>; // Make it required
// };

// const Chat: React.FC<ChatProps> = ({ functionCallHandler }) => {
//   const [userInput, setUserInput] = useState("");
//   const [messages, setMessages] = useState<MessageProps[]>([]);
//   const [inputDisabled, setInputDisabled] = useState(false);
//   const [threadId, setThreadId] = useState("");

//   // Automatically scroll to the bottom of the chat
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Create a new thread ID when the chat component is created
//   useEffect(() => {
//     const createThread = async () => {
//       const res = await fetch(`/api/assistants/threads`, {
//         method: "POST",
//       });
//       const data = await res.json();
//       setThreadId(data.threadId);
//     };
//     createThread();
//   }, []);

//   const sendMessage = async (text: string) => {
//     // Construct the tool call with required properties
//     const toolCall: RequiredActionFunctionToolCall = {
//       id: "user-input", // Example ID; tailor to your needs
//       function: processMessage, // Here processMessage is a reference to the actual function
//       type: "function", // This must be "function" as per the type definition
//       // Note: assuming no parameters property exists as per your earlier message
//     };

//     // Call the functionCallHandler with the constructed tool call
//     const response = await functionCallHandler(toolCall);

//     // Update messages with user input and assistant response
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { role: "user", text: userInput }, // User message
//       { role: "assistant", text: response } // Assistant response
//     ]);

//     setUserInput(""); // Clear the input field
//     setInputDisabled(false); // Re-enable input for new messages
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault(); // Prevent form submission
//     if (!userInput.trim()) return; // Check that input is not empty

//     sendMessage(userInput); // Send the user input
//     setInputDisabled(true); // Disable the input field until the response is received
//   };

//   return (
//     <div className={styles.chatContainer}>
//       <div className={styles.messages}>
//         {messages.map((msg, index) => (
//           <Message key={index} role={msg.role} text={msg.text} />
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <form onSubmit={handleSubmit} className={`${styles.inputForm} ${styles.clearfix}`}>
//         <input
//           type="text"
//           className={styles.input}
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           placeholder="Enter your question"
//           disabled={inputDisabled}
//         />
//         <button type="submit" className={styles.button} disabled={inputDisabled}>
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// // Define the processMessage function to handle message processing
// const processMessage = async (args: any) => {
//   const content = args.content || ""; // Get content from parameters if available
//   // Implement your message processing logic here
//   return `Processed message: ${content}`; // Return your response string here
// };

// export default Chat;

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import styles from "./chat.module.css";
// import { AssistantStream } from "openai/lib/AssistantStream"; // Required for streaming responses
// import Markdown from "react-markdown"; // For rendering markdown responses
// import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants"; // Type definitions
// import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs"; // Function tool call type definition

// type MessageProps = {
//   role: "user" | "assistant" | "code";
//   text: string;
// };

// // UI Components for different message roles
// const UserMessage = ({ text }: { text: string }) => <div className={styles.userMessage}>{text}</div>;
// const AssistantMessage = ({ text }: { text: string }) => (
//   <div className={styles.assistantMessage}><Markdown>{text}</Markdown></div>
// );
// const CodeMessage = ({ text }: { text: string }) => (
//   <div className={styles.codeMessage}>
//     {text.split("\n").map((line, index) => (
//       <div key={index}>
//         <span>{`${index + 1}. `}</span>{line}
//       </div>
//     ))}
//   </div>
// );

// // Message rendering logic
// const Message = ({ role, text }: MessageProps) => {
//   switch (role) {
//     case "user":
//       return <UserMessage text={text} />;
//     case "assistant":
//       return <AssistantMessage text={text} />;
//     case "code":
//       return <CodeMessage text={text} />;
//     default:
//       return null;
//   }
// };

// // Props interface for Chat component
// type ChatProps = {
//   functionCallHandler?: (toolCall: RequiredActionFunctionToolCall) => Promise<string>; // Function handler
// };

// // Chat component definition
// const Chat: React.FC<ChatProps> = ({
//   functionCallHandler = () => Promise.resolve(""),
// }) => {
//   const [userInput, setUserInput] = useState("");
//   const [messages, setMessages] = useState<MessageProps[]>([]);
//   const [inputDisabled, setInputDisabled] = useState(false);
//   const [threadId, setThreadId] = useState("");

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Create a new thread when the component is mounted
//   useEffect(() => {
//     const createThread = async () => {
//       const res = await fetch(`/api/assistants/threads`, { method: "POST" });
//       const data = await res.json();
//       setThreadId(data.threadId);
//     };
//     createThread();
//   }, []);

//   // Function to send a message to the AI
//   const sendMessage = async (text: string) => {
//     setInputDisabled(true);
//     const response = await fetch(`/api/assistants/threads/${threadId}/messages`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ content: text }),
//     });

//     if (!response.ok) {
//       console.error("Error sending message:", response.statusText);
//       setInputDisabled(false);
//       return;
//     }

//     const stream = AssistantStream.fromReadableStream(response.body);
//     handleReadableStream(stream);
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!userInput.trim()) return;

//     sendMessage(userInput); // Send the user input
//     setMessages([...messages, { role: "user", text: userInput }]); // Update message state
//     setUserInput(""); // Clear input field
//     setInputDisabled(true); // Disable input until message is processed
//   };

//   /* Stream Event Handlers */

//   const handleTextCreated = () => appendMessage("assistant", ""); // Handle new assistant message
//   const handleTextDelta = (delta: { value?: string; annotations?: any }) => {
//     if (delta.value) appendToLastMessage(delta.value);
//     if (delta.annotations) annotateLastMessage(delta.annotations);
//   };
//   const handleImageFileDone = (image: { file_id: string }) => {
//     appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
//   };

//   const toolCallCreated = (toolCall: { type: string }) => {
//     if (toolCall.type !== "code_interpreter") return;
//     appendMessage("code", "");
//   };

//   const toolCallDelta = (delta: { type: string; code_interpreter?: { input?: string } }, snapshot: any) => {
//     if (delta.type !== "code_interpreter") return;
//     if (delta.code_interpreter?.input) appendToLastMessage(delta.code_interpreter.input);
//   };

//   const handleRequiresAction = async (
//     event: AssistantStreamEvent.ThreadRunRequiresAction
//   ) => {
//     const runId = event.data.id;
//     const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
//     const toolCallOutputs = await Promise.all(
//       toolCalls.map(async (toolCall) => {
//         const result = await functionCallHandler(toolCall);
//         return { output: result, tool_call_id: toolCall.id };
//       })
//     );
//     setInputDisabled(true);
//     await submitActionResult(runId, toolCallOutputs); // Submit the action result
//   };

//   const handleRunCompleted = () => setInputDisabled(false); // Re-enable input on run completion

//   const handleReadableStream = (stream: AssistantStream) => {
//     stream.on("textCreated", handleTextCreated);
//     stream.on("textDelta", handleTextDelta);
//     stream.on("imageFileDone", handleImageFileDone);
//     stream.on("toolCallCreated", toolCallCreated);
//     stream.on("toolCallDelta", toolCallDelta);
//     stream.on("event", (event) => {
//       if (event.event === "thread.run.requires_action") handleRequiresAction(event);
//       if (event.event === "thread.run.completed") handleRunCompleted();
//     });
//   };

//   const appendToLastMessage = (text: string) => {
//     setMessages((prevMessages) => {
//       const lastMessage = prevMessages[prevMessages.length - 1];
//       const updatedLastMessage = { ...lastMessage, text: lastMessage.text + text };
//       return [...prevMessages.slice(0, -1), updatedLastMessage]; // Update last message
//     });
//   };

//   const appendMessage = (role: MessageProps["role"], text: string) =>
//     setMessages((prevMessages) => [...prevMessages, { role, text }]);

//   const annotateLastMessage = (annotations: any) => {
//     setMessages((prevMessages) => {
//       const lastMessage = prevMessages[prevMessages.length - 1];
//       const updatedLastMessage = { ...lastMessage };

//       annotations.forEach((annotation: { type: string; text: string; file_path?: { file_id: string } }) => {
//         if (annotation.type === "file_path" && annotation.file_path) {
//           updatedLastMessage.text = updatedLastMessage.text.replaceAll(
//             annotation.text,
//             `/api/files/${annotation.file_path.file_id}`
//           );
//         }
//       });

//       return [...prevMessages.slice(0, -1), updatedLastMessage];
//     });
//   };

//   return (
//     <div className={styles.chatContainer}>
//       <div className={styles.messages}>
//         {messages.map((msg, index) => (
//           <Message key={index} role={msg.role} text={msg.text} />
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <form onSubmit={handleSubmit} className={`${styles.inputForm} ${styles.clearfix}`}>
//         <input
//           type="text"
//           className={styles.input}
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           placeholder="Enter your question"
//           disabled={inputDisabled}
//         />
//         <button type="submit" className={styles.button} disabled={inputDisabled}>
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Chat;

"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css"; // Adjust path as necessary
import { AssistantStream } from "openai/lib/AssistantStream"; // Required for streaming responses
import Markdown from "react-markdown"; // For rendering markdown responses
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs"; // Function tool call type definition

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
};

// UI Components for different message roles
const UserMessage = ({ text }: { text: string }) => (
  <div className={styles.userMessage}>{text}</div>
);
const AssistantMessage = ({ text }: { text: string }) => (
  <div className={styles.assistantMessage}>
    <Markdown>{text}</Markdown>
  </div>
);
const CodeMessage = ({ text }: { text: string }) => (
  <div className={styles.codeMessage}>
    {text.split("\n").map((line, index) => (
      <div key={index}>
        <span>{`${index + 1}. `}</span>
        {line}
      </div>
    ))}
  </div>
);

// Message rendering logic
const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    case "code":
      return <CodeMessage text={text} />;
    default:
      return null;
  }
};

// Props interface for Chat component
type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>; // Function handler
};

// Chat component definition
const Chat: React.FC<ChatProps> = ({
  functionCallHandler = () => Promise.resolve(""),
}) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create a new thread when the component is mounted
  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, { method: "POST" });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  // Function to send a message to the AI
  const sendMessage = async (text: string) => {
    setInputDisabled(true); // Disable input while processing

    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      }
    );

    if (!response.ok) {
      console.error("Error sending message:", response.statusText);
      setInputDisabled(false); // Re-enable input on error
      return; // Exit if there's an error
    }

    // Ensure response.body is not null before creating a readable stream
    if (response.body === null) {
      console.error(
        "Response body is null. Unable to create a readable stream."
      );
      setInputDisabled(false); // Re-enable input before returning
      return; // Handle accordingly
    }

    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    if (!userInput.trim()) return; // Ensure input is non-empty

    sendMessage(userInput); // Send the user input

    // Update messages with user input
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput }, // User message
    ]);

    setUserInput(""); // Clear input field
  };

  /* Stream Event Handlers */

  const handleTextCreated = () => appendMessage("assistant", ""); // Handle new assistant message

  const handleTextDelta = (delta: { value?: string; annotations?: any }) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value); // Append incoming text
    }
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  const handleImageFileDone = (image: { file_id: string }) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  };

  const toolCallCreated = (toolCall: { type: string }) => {
    if (toolCall.type != "code_interpreter") return;
    appendMessage("code", ""); // Create new code message
  };

  const toolCallDelta = (
    delta: { type: string; code_interpreter?: { input?: string } },
    snapshot: any
  ) => {
    if (delta.type != "code_interpreter") return;
    if (delta.code_interpreter?.input)
      appendToLastMessage(delta.code_interpreter.input);
  };

  const handleRequiresAction = async (event: any) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    // Loop over tool calls and call function handler
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true); // Disable input while submitting action results
    await submitActionResult(runId, toolCallOutputs); // Ensure submitActionResult is defined below
  };

  const handleRunCompleted = () => setInputDisabled(false); // Re-enable input on run completion

  const handleReadableStream = (stream: AssistantStream) => {
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);
    stream.on("imageFileDone", handleImageFileDone);
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };

  // Utility Functions
  const appendToLastMessage = (text: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage]; // Update last message
    });
  };

  const appendMessage = (role: MessageProps["role"], text: string) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const annotateLastMessage = (annotations: any) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = { ...lastMessage };

      annotations.forEach(
        (annotation: {
          type: string;
          text: string;
          file_path?: { file_id: string };
        }) => {
          if (annotation.type === "file_path" && annotation.file_path) {
            updatedLastMessage.text = updatedLastMessage.text.replaceAll(
              annotation.text,
              `/api/files/${annotation.file_path.file_id}`
            );
          }
        }
      );

      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  // Define the submitActionResult function
  const submitActionResult = async (runId: string, toolCallOutputs: any[]) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      }
    );

    // Check for response errors
    if (!response.ok) {
      console.error("Error submitting action result:", response.statusText);
      return; // Handle error accordingly
    }

    // Ensure response.body is not null before creating a readable stream
    if (response.body === null) {
      console.error(
        "Response body is null. Unable to create a readable stream."
      );
      return; // Handle the null case gracefully
    }

    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream); // Process the incoming stream
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className={`${styles.inputForm} ${styles.clearfix}`}
      >
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your question"
          disabled={inputDisabled}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={inputDisabled}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
