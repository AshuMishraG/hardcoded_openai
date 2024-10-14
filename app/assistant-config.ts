export let assistantId = "asst_RZBTqqUlRwWLfrTLlrNUmVjc"; // set your assistant ID here

if (assistantId === "") {
  const envAssistantId = process.env.OPENAI_ASSISTANT_ID;
  if (envAssistantId !== undefined) {
    assistantId = envAssistantId; // Only assign if defined
  } else {
    throw new Error("OPENAI_ASSISTANT_ID is not defined in the environment variables.");
  }
}
