import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Create a new assistant
export async function POST() {
  const assistant = await openai.beta.assistants.create({
    instructions:
      "You are an AI assistant dedicated to helping parents and students explore the courses offered at Manav Rachna Institutions. Your task is to guide them through the process of selecting courses, understanding eligibility, and providing details on fees, admission, and campus visits. Tone: Polite, conversational, and friendly. Keep responses concise and relevant, answering only what’s asked based on prior responses. Throughout the conversation, use any uploaded documents to provide specific program details, eligibility criteria, or fee structure, ensuring that the responses are accurate and tailored to the visitor’s needs.",
    name: "Counselling Buddy",
    model: "gpt-4o",
    tools: [
      // { type: "code_interpreter" },
      // {
      //   type: "function",
      //   function: {
      //     name: "get_weather",
      //     description: "Determine weather in my location",
      //     parameters: {
      //       type: "object",
      //       properties: {
      //         location: {
      //           type: "string",
      //           description: "The city and state e.g. San Francisco, CA",
      //         },
      //         unit: {
      //           type: "string",
      //           enum: ["c", "f"],
      //         },
      //       },
      //       required: ["location"],
      //     },
      //   },
      // },
      { type: "file_search" },
    ],
  });
  return Response.json({ assistantId: assistant.id });
}
