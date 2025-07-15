"use client";
import { useState, useCallback } from "react";

export default function useStepCompareAnimation(runStepFns) {
  // runStepFns = [reset, step1, step2, step3]
  const [step, setStep] = useState(0);

  const next = useCallback(() => {
    const nextStep = (step + 1) % runStepFns.length;  // 순환
    runStepFns[nextStep]();
    setStep(nextStep);
  }, [step, runStepFns]);

  return { step, next };
}
