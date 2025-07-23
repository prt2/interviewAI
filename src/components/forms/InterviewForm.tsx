import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createInterview } from "@/utils/api/interviews";
import { BaseInterview } from "@/models/interview";
import { useState } from "react";
import { toast } from "sonner";

interface InterviewFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  userId?: string;
}

/**
 * InterviewForm component for creating a new interview entry.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onSubmit - Callback function to be called on successful form submission.
 * @param {Function} props.onCancel - Callback function to be called when the cancel button is clicked.
 * @param {string} props.userId - The ID of the user creating the interview.
 *
 * @returns {JSX.Element} The rendered InterviewForm component.
 */
export function InterviewForm({
  onSubmit,
  onCancel,
  userId,
}: InterviewFormProps) {
  const [jobTitle, setjobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    setIsSaving(true);

    try {
      const interview_info: BaseInterview = {
        job_title: jobTitle,
        job_description: jobDescription,
        company: company,
        created_at: {
          date: new Date(),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      };

      await createInterview(userId, interview_info);
      onSubmit();

      toast.success("Resume updated successfully!");
    } catch (error) {
      console.error("Error updating resume:", error);
      toast.error("Failed to update resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="">Company</Label>
        <Input
          id="company"
          placeholder="Paste the complete job description here..."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Position</Label>
        <Input
          id="jobTitle"
          placeholder="e.g., Senior Frontend Developer"
          value={jobTitle}
          onChange={(e) => setjobTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobDescription">Job Description</Label>
        <Textarea
          id="jobDescription"
          placeholder="Paste the complete job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[200px]"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Create Interview"}
        </Button>
      </div>
    </form>
  );
}
