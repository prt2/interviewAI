import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import {
  getResumeDetails,
  updateResumeSection,
  updateResumeExperience,
} from "@/utils/api/resume";
import { toast } from "sonner";
import { Resume, ResumeExperience } from "@/models/resume";
import IsLoading from "../layout/IsLoading";

interface ResumeFormProps {
  onSubmit: (data: Resume) => void;
  onCancel: () => void;
  userId?: string;
}
/**
 * A form component for creating and updating a user's resume.
 *
 * @param {Object} props - The properties for the component.
 * @param {Function} props.onSubmit - Callback function to handle form submission with the updated resume data.
 * @param {Function} props.onCancel - Callback function to handle cancellation of the form.
 * @param {string} props.userId - The ID of the user whose resume is being edited.
 *
 * @returns {JSX.Element} The rendered form component.
 *
 * @example
 * <ResumeForm
 *   onSubmit={(data) => console.log(data)}
 *   onCancel={() => console.log('Cancelled')}
 *   userId="12345"
 * />
 */
export function ResumeForm({ onSubmit, onCancel, userId }: ResumeFormProps) {
  const [projects, setProjects] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeExperience, setResumeExperience] = useState<ResumeExperience[]>([
    { id: "1", position: "", description: "" },
  ]);
  const [other, setOther] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resumeId, setResumeId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error("User ID is not available.");
        toast.error("User not authenticated. Please log in.");
        return;
      }

      setIsLoading(true);
      try {
        const data = await getResumeDetails(userId);

        setResumeId(data.id);
        setSkills(data.skills || "");
        setProjects(data.projects || "");
        setResumeExperience(
          data.experience.length > 0
            ? data.experience
            : [{ id: "1", position: "", description: "" }]
        );
        setOther(data.other || "");
      } catch (error) {
        console.error("Error fetching resume data:", error);
        toast.error("Failed to load resume data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const addResumeExperience = () => {
    setResumeExperience([
      ...resumeExperience,
      { id: Date.now().toString(), position: "", description: "" },
    ]);
  };

  const removeResumeExperience = (id: string) => {
    if (resumeExperience.length > 1) {
      setResumeExperience(resumeExperience.filter((exp) => exp.id !== id));
    }
  };

  const updateExperienceField = (
    id: string,
    field: keyof ResumeExperience,
    value: string
  ) => {
    setResumeExperience(
      resumeExperience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    setIsSaving(true);

    try {
      // Filter out empty experience entries
      const validExperience = resumeExperience.filter(
        (exp) => exp.position.trim() || exp.description.trim()
      );

      // Update all sections in parallel for better performance
      await Promise.all([
        updateResumeSection(userId, resumeId, "projects", projects),
        updateResumeSection(userId, resumeId, "skills", skills),
        updateResumeSection(userId, resumeId, "other", other),
        updateResumeExperience(userId, resumeId, validExperience),
      ]);

      // Create the resume object to pass to parent
      const resumeData: Resume = {
        id: userId,
        projects,
        skills,
        experience: validExperience,
        other,
      };

      // Call parent's onSubmit with the updated data
      onSubmit(resumeData);

      toast.success("Resume updated successfully!");
    } catch (error) {
      console.error("Error updating resume:", error);
      toast.error("Failed to update resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while fetching data
  if (isLoading) {
    <IsLoading />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="projects">Projects</Label>
        <Textarea
          id="projects"
          placeholder="Describe your key projects..."
          value={projects}
          onChange={(e) => setProjects(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="techStacks">Tech Stacks & Skills</Label>
        <Textarea
          id="techStacks"
          placeholder="List your technical skills, frameworks, languages..."
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Job Experience</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addResumeExperience}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>

        {resumeExperience.map((experience, index) => (
          <Card key={experience.id} className="border border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  Experience {index + 1}
                </CardTitle>
                {resumeExperience.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeResumeExperience(experience.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`position-${experience.id}`}>Position</Label>
                <Input
                  id={`position-${experience.id}`}
                  placeholder="Job title/position"
                  value={experience.position}
                  onChange={(e) =>
                    updateExperienceField(
                      experience.id,
                      "position",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`description-${experience.id}`}>
                  Description
                </Label>
                <Textarea
                  id={`description-${experience.id}`}
                  placeholder="Describe your responsibilities and achievements..."
                  value={experience.description}
                  onChange={(e) =>
                    updateExperienceField(
                      experience.id,
                      "description",
                      e.target.value
                    )
                  }
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="other">Other Information</Label>
        <Textarea
          id="other"
          placeholder="Any additional information you'd like to include..."
          value={other}
          onChange={(e) => setOther(e.target.value)}
          className="min-h-[80px]"
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
          {isSaving ? "Saving..." : "Save Resume"}
        </Button>
      </div>
    </form>
  );
}
