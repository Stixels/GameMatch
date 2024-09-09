"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

type QuestionType = "checkbox" | "radio" | "slider";

interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  min?: number;
  max?: number;
}

const questions: Question[] = [
  {
    id: "genres",
    question: "What genres do you enjoy?",
    type: "checkbox",
    options: [
      "Action",
      "Adventure",
      "RPG",
      "Strategy",
      "Simulation",
      "Sports",
      "Puzzle",
      "Shooter",
    ],
  },
  {
    id: "playTime",
    question:
      "How much time do you typically spend playing games in one session?",
    type: "radio",
    options: [
      "Less than 1 hour",
      "1-2 hours",
      "2-4 hours",
      "More than 4 hours",
    ],
  },
  {
    id: "difficulty",
    question: "What difficulty level do you prefer?",
    type: "radio",
    options: ["Easy", "Medium", "Hard", "Variable"],
  },
  {
    id: "multiplayer",
    question: "Do you prefer single-player or multiplayer games?",
    type: "radio",
    options: ["Single-player", "Multiplayer", "Both"],
  },
  {
    id: "graphics",
    question: "How important are cutting-edge graphics to you?",
    type: "slider",
    min: 0,
    max: 10,
  },
  {
    id: "story",
    question: "How important is a strong narrative or story?",
    type: "slider",
    min: 0,
    max: 10,
  },
];

type Answers = {
  [key: string]: string | string[] | number;
};

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState(0);

  const handleInputChange = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (
    questionId: string,
    option: string,
    checked: boolean
  ) => {
    setAnswers((prev) => {
      const currentValues = (prev[questionId] as string[]) || [];
      if (checked) {
        return { ...prev, [questionId]: [...currentValues, option] };
      } else {
        return {
          ...prev,
          [questionId]: currentValues.filter((item) => item !== option),
        };
      }
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setDirection(1);
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Questionnaire answers:", answers);
    router.push("/results");
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={((answers[question.id] as string[]) || []).includes(
                    option
                  )}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      question.id,
                      option,
                      checked as boolean
                    )
                  }
                />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case "radio":
        return (
          <RadioGroup
            value={(answers[question.id] as string) || ""}
            onValueChange={(value) => handleInputChange(question.id, value)}
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "slider":
        return (
          <div className="space-y-4">
            <Slider
              min={question.min || 0}
              max={question.max || 10}
              step={1}
              value={[(answers[question.id] as number) || 5]}
              onValueChange={(value) =>
                handleInputChange(question.id, value[0])
              }
            />
            <div className="text-center">
              Current value: {(answers[question.id] as number) || 5}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Gaming Preferences Questionnaire
      </h1>
      <div className="relative overflow-hidden" style={{ minHeight: "300px" }}>
        {" "}
        {/* Adjust minHeight as needed */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentQuestion}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute w-full"
          >
            <h2 className="text-xl font-semibold mb-4">
              {questions[currentQuestion].question}
            </h2>
            {renderQuestion(questions[currentQuestion])}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-8">
        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>
    </div>
  );
}
