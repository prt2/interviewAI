import { collection, doc, getDocs, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase/firebaseConfig";
import { Resume, ResumeExperience } from "@/models/resume";

/**
 * Updates the experience section of a user's resume in the database.
 *
 * @param userId - The ID of the user whose resume is being updated.
 * @param resumeId - The ID of the resume to be updated.
 * @param experience - An array of ResumeExperience objects representing the user's work experience.
 * @returns A promise that resolves when the update is complete.
 * @throws Will throw an error if the update fails.
 */
export async function updateResumeExperience(
  userId: string,
  resumeId: string,
  experience: ResumeExperience[]
): Promise<void> {
  const resumeRef = doc(db, "users", userId, "resume", resumeId);
  try {
    await setDoc(resumeRef, { experience: experience }, { merge: true });
  } catch (error) {
    console.error("Error updating experience section:", error);
    throw error;
  }
}

/**
 * Retrieves the resume details for a specific user.
 *
 * @param userId - The unique identifier of the user whose resume details are to be fetched.
 * @returns A promise that resolves to a Resume object containing the user's resume details.
 */
export async function getResumeDetails(userId: string): Promise<Resume> {
  const resumeRef = collection(db, "users", userId, "resume");
  const snapshot = await getDocs(resumeRef);

  const resume: Resume = {
    id: userId,
    experience: [],
    other: "",
    projects: "",
    skills: "",
  };

  snapshot.docs.forEach((doc) => {
    resume.experience = doc.get("experience") || [];
    resume.other = doc.get("other") || "";
    resume.projects = doc.get("projects") || "";
    resume.skills = doc.get("skills") || "";
  });

  return resume;
}

/**
 * Updates a specific section of a user's resume in the database.
 *
 * @param userId - The ID of the user whose resume is being updated.
 * @param resumeId - The ID of the resume to update.
 * @param section - The section of the resume to update. Can be "other", "projects", or "skills".
 * @param content - The new content to set for the specified section.
 * @returns A promise that resolves when the update is complete.
 * @throws Will log an error if the update fails.
 */
export async function updateResumeSection(
  userId: string,
  resumeId: string,
  section: "other" | "projects" | "skills",
  content: string
): Promise<void> {
  try {
    const sectionRef = doc(db, "users", userId, "resume", resumeId);
    await setDoc(sectionRef, { [section]: content }, { merge: true });
  } catch (error) {
    console.error(`Error updating ${section} section:`, error);
  }
}
