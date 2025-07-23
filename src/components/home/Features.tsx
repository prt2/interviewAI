import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  FileText,
  MessageSquare,
  Target,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Resume",
    description:
      "Securely upload and store your resume details for personalized question generation.",
  },
  {
    icon: FileText,
    title: "Job Descriptions",
    description:
      "Input job descriptions to get role-specific interview questions and preparation tips.",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description:
      "Interactive AI chatbot that generates custom interview questions based on your profile.",
  },
  {
    icon: Target,
    title: "Targeted Prep",
    description:
      "Get questions tailored to your experience level and the specific role you're applying for.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Monitor your preparation progress and identify areas for improvement.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive interview preparation tools powered by AI to help you
            land your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-medium hover:shadow-large transition-all duration-300 bg-card/90 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
