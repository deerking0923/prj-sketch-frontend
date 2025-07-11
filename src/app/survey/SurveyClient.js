"use client";

import { useEffect, useRef } from "react";

export default function SurveyClient() {
  const hasRun = useRef(false); // 중복 실행 방지

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    import("jspsych").then(({ initJsPsych }) => {
      import("@jspsych/plugin-html-button-response").then((plugin) => {
        const jsPsych = initJsPsych({
          on_finish: () => {
            const results = jsPsych.data.get().values();

            // 변환: 각 항목에 rawJson도 포함시켜 전송
            const payload = results.map((item) => ({
              userID: item.userID || "defaultUser",
              condition: item.condition || "A",
              trialIndex: item.trial_index,
              trialType: item.trial_type,
              stimulus: item.stimulus,
              response: item.response,
              rt: item.rt,
              timeElapsed: item.time_elapsed,
              rawJson: JSON.stringify(item),
            }));

            fetch("https://dadoklog.com/api/v1/experiment-results", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }).then((res) => {
              if (res.ok) {
                console.log("✅ 실험 결과 전송 성공");
              } else {
                console.error("❌ 전송 실패");
              }
            });
          },
        });

        const timeline = [
          {
            type: plugin.default,
            stimulus: "Which planet is known as the Red Planet?",
            choices: ["Earth", "Mars", "Jupiter"],
            data: { question: "planet" },
          },
        ];

        jsPsych.run(timeline);
      });
    });
  }, []);

  return (
    <>
      <link href="/jspsych.css" rel="stylesheet" />
      <div id="jspsych-target" />
    </>
  );
}
