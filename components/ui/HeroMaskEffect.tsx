// src/components/HeroMaskEffect.tsx

"use client"; // This makes the component interactive

import { MaskContainer } from "@/components/ui/svg-mask-effect"; // Assuming your mask component is here

export function HeroMaskEffect() {
  return (
    <div className="flex h-[40rem] w-full items-center justify-center overflow-hidden">
      <MaskContainer
        revealText={
          <h1 className="mx-auto max-w-4xl text-center text-5xl font-bold text-slate-800 dark:text-white md:text-6xl">
            The AI-Powered Platform for{" "}
            <span className="text-primary">Indian Educators</span>
          </h1>
        }
        className="h-auto rounded-md border text-white dark:text-black"
      >
        Automate non-teaching tasks and empower student learning with{" "}
        <span className="text-blue-500">AI-driven tools</span> for curriculum
        design, grading, attendance, and{" "}
        <span className="text-blue-500">personalized education</span>.
      </MaskContainer>
    </div>
  );
}