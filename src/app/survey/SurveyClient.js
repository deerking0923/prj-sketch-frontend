"use client";

import { useEffect, useRef } from "react";
import FilterAnimation from "../components/FilterAnimation";
import "jspsych/css/jspsych.css";

export default function SurveyClient() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    Promise.all([
      import("jspsych").then((m) => m.initJsPsych),
      import("@jspsych/plugin-survey-likert"),
    ]).then(([initJsPsych, likert]) => {
      /* ✅ on_finish 콜백 복원! */
      const jsPsych = initJsPsych({
  display_element: "jspsych-target",
  on_finish: () => {
    let rows = jsPsych.data.get().values();

    /* 평탄화 + snake_case 변환 */
    rows = rows.map(r => ({
      trial_index:  r.trial_index ?? r.trialIndex,
      trial_type:   r.trial_type  ?? r.trialType,
      rating:       r.response?.Q0 ?? null,
      time_elapsed: r.time_elapsed ?? r.timeElapsed,
      user_id:      r.userID ?? "defaultUser",
      condition:    r.condition ?? "A",
    }));

    /* 행별 전송 → 실패 로그 확인 */
    Promise.all(rows.map(row =>
      fetch("/api/v1/experiment-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      }).then(res =>
        res.ok
          ? console.log("✅", row.trial_index)
          : res.text().then(t => console.error("❌", row.trial_index, t)),
      )
    ));
  },
});


      jsPsych.run([
        {
          type: likert.default,
          questions: [
            {
              prompt: "이 설명 방식이 도움이 되시나요?",
              labels: ["1", "2", "3", "4", "5"],
              required: true,
            },
          ],
          button_label: "제출",
          data: { question: "helpfulness_rating" },
        },
      ]);
    });
  }, []);

  return (
    <>
      <FilterAnimation csvUrl="/data/kong_71.csv" />
      <div id="jspsych-target" style={{ marginTop: "2rem" }} />
    </>
  );
}
