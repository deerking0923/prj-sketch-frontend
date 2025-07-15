"use client";

import React from "react";
import AgeGenderChart from "../components/AgeGenderChart";
import WelcomeFeelAnimation from "../components/WelcomeFeelAnimation";
import "../style/ageChart.css";

export default function SamplePage() {
  return (
    <main className="container">
      <h1 className="heading">Employment Rate by Age Group &amp; Gender</h1>

      {/* Static overview chart */}
      <AgeGenderChart csvUrl="/data/kong_71.csv" />

      {/* Question + animated answer */}
      <WelcomeFeelAnimation csvUrl="/data/kong_71.csv" />
    </main>
  );
}
