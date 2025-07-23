"use client";

import { BrainCircuit, Sparkles, Target } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="container mx-auto px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border bg-card px-4 py-2 text-sm shadow-subtle">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              AI-Powered Interview Preparation
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Ace Your Next
              <span className="bg-primary bg-clip-text text-transparent">
                {" "}
                Interview
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload your resume, paste job descriptions, and get personalized
              AI-generated interview questions to help you prepare and succeed.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-primary" />
              <span>Tailored Questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <BrainCircuit className="h-4 w-4 text-primary" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Smart Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/3 blur-3xl"></div>
      </div>
    </section>
  );
}
