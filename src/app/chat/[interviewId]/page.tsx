"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { buildPrompt } from "@/lib/prompt";
import { Interview } from "@/models/interview";
import { Resume } from "@/models/resume";
import { getInterviewById } from "@/utils/api/interviews";
import { getResumeDetails } from "@/utils/api/resume";
import { useChat } from "@ai-sdk/react";
import { Bot, Loader2, MessageSquare, Send, User } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Chat component for conducting interview preparation chats.
 *
 * This component fetches interview and resume data based on the user's ID and the interview ID
 * provided in the parameters. It utilizes a chat interface to allow users to interact with an AI
 * assistant that generates personalized interview questions and provides guidance.
 *
 * @param params - A promise that resolves to an object containing the interviewId.
 * @returns A JSX element representing the chat interface.
 */
export default function Chat({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { user } = useAuth();
  const userId = user?.uid;
  const { interviewId } = use(params);
  const [interviewData, setInterviewData] = useState<Interview>();
  const [, setResumeData] = useState<Resume>();
  const [systemPrompt, setSystemPrompt] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        return;
      }
      try {
        const interviewData = await getInterviewById(userId, interviewId);
        const resumeData = await getResumeDetails(userId);

        setInterviewData(interviewData);
        setResumeData(resumeData);

        // Build the system prompt when interview data is loaded
        if (interviewData && resumeData) {
          const prompt = buildPrompt(interviewData, resumeData);
          setSystemPrompt(prompt);
        }
      } catch (error) {
        console.error("Error fetching interview data:", error);
        toast.error("Failed to load interview data.");
      }
    };
    fetchData();
  }, [interviewId, userId]);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        systemPrompt: systemPrompt,
      },
    });

  const onSubmit = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-12rem)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isLoading ? "bg-yellow-500" : "bg-green-500"
                    }`}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {isLoading ? "Thinking..." : "Online"}
                  </span>
                </div>
                <p className="text-sm">
                  I can help you prepare for interviews by generating
                  personalized questions based on your profile.
                </p>
                {interviewData && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Interview Details:
                    </p>
                    <p className="text-sm">{interviewData.job_title}</p>
                    <p className="text-xs text-muted-foreground">
                      {interviewData.company}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="border-0 shadow-medium flex-1 flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Interview Prep Chat
                </CardTitle>
              </CardHeader>

              {/* Scrollable Messages Container */}
              <CardContent className="flex-1">
                <div className="h-96 overflow-y-auto p-6 space-y-6">
                  {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">
                          Start a conversation to get personalized interview
                          questions
                        </p>
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role !== "user" && (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {/* Handle different message content formats */}
                          {message.content &&
                          typeof message.content === "string"
                            ? message.content
                            : message.parts?.map((part, index) =>
                                part.type === "text" ? (
                                  <span key={index}>{part.text}</span>
                                ) : null
                              )}
                        </div>
                        {message.createdAt && (
                          <p
                            className={`text-xs mt-2 ${
                              message.role === "user"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {new Date(message.createdAt)
                              .getHours()
                              .toString()
                              .padStart(2, "0")}
                            :
                            {new Date(message.createdAt)
                              .getMinutes()
                              .toString()
                              .padStart(2, "0")}
                          </p>
                        )}
                      </div>

                      {message.role === "user" && (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">
                            Thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              {/* Input Section */}
              <div className="p-6 border-t">
                <div className="flex gap-3">
                  <Input
                    name="prompt"
                    value={input}
                    type="text"
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSubmit(e);
                      }
                    }}
                    placeholder="Ask for interview questions, preparation tips, or specific guidance..."
                    className="flex-1"
                    disabled={isLoading}
                  />

                  <Button
                    type="submit"
                    onClick={onSubmit}
                    disabled={!input.trim() || isLoading}
                    className="shadow-medium"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to send • AI responses are generated based on your
                  interview profile and preferences
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
