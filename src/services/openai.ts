import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ProposalRequest {
  jobTitle: string;
  jobDescription: string;
  skills: string;
  experience: string;
}

export interface ProposalResponse {
  opening: string;
  body: string;
  painPoints: string[];
  relevantExperience: string;
  callToAction: string;
  followUpMessage: string;
  score: number;
  scoreBreakdown: {
    relevance: number;
    clarity: number;
    personalization: number;
    hookStrength: number;
  };
}

export async function generateProposal(data: ProposalRequest): Promise<ProposalResponse> {
  const prompt = `
    You are an expert Upwork freelancer specialized in writing high-converting proposals.
    Analyze the following job details and freelancer profile to generate a personalized proposal.
    
    Job Title: ${data.jobTitle}
    Job Description: ${data.jobDescription}
    Freelancer Skills: ${data.skills}
    Freelancer Experience: ${data.experience}
    
    Requirements:
    1. Craft an attention-grabbing opening line.
    2. Surface client pain points from the description (list 2-4).
    3. Show how the freelancer's skills/experience solve those pain points (relevantExperience).
    4. Write a full proposal body that structures: hook → pain point acknowledgement → relevant experience → solution approach.
    5. End with a clear call to action.
    6. Include a follow-up message for the freelancer to send if the client doesn't respond in 3-4 days.
    7. Provide a score (0-100) on how well the freelancer matches the job.
    8. Provide a score breakdown with relevance, clarity, personalization, and hookStrength (each 0-100).
    
    Return valid JSON only:
    {
      "opening": "attention-grabbing opening line",
      "body": "full proposal body with clear sections",
      "painPoints": ["client pain point 1", "client pain point 2"],
      "relevantExperience": "how the freelancer's skills solve the client's needs",
      "callToAction": "clear next step for the client",
      "followUpMessage": "follow-up message for 3-4 days later",
      "score": 85,
      "scoreBreakdown": {
        "relevance": 90,
        "clarity": 85,
        "personalization": 80,
        "hookStrength": 75
      }
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a professional Upwork proposal writer. Output JSON only." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("Failed to generate proposal");
  }

  return JSON.parse(content) as ProposalResponse;
}
