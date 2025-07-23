import { Interview } from "@/models/interview";
import { Resume } from "@/models/resume";

/**
 * Builds a personalized interview preparation prompt based on the user's interview and resume information.
 *
 * @param interview_info - An object containing details about the interview, including job description, company, and job title.
 * @param resume_info - An object containing the user's resume information, including skills, projects, experience, and other information.
 * @returns A string that serves as a personalized prompt for interview preparation.
 */
export function buildPrompt(interview_info: Interview, resume_info: Resume) {
  const { job_description, company, job_title } = interview_info;
  const { experience, other, projects, skills } = resume_info;

  const basePrompt = `You are an expert interview software engineering preparation assistant. Your role is to help users with their software engineering interviews. 
        You have expert knowledge of software engineering concepts, algorithms, data structures, system design, and behavioral interview techniques.
        You will generate personalized interview questions based on the user's job description, company, and job title.
        The user is preparing for a software engineering interview at ${company} for the position of ${job_title}.
        The job description is as follows: ${job_description}.
        The user will send you their answer to the questions and you will provide feedback on their answers.
        Here is the user's resume information: 
        Skills: ${skills}
        Projects: ${projects}
        Experience: ${experience
          .map((exp) => `${exp.position}: ${exp.description}`)
          .join("\n")}
        Other Information: ${other}
        `;

  return basePrompt;
}
