'use strict';

require('dotenv').config();
const axios = require('axios');

/* =====================================================
   OPENROUTER CORE
===================================================== */

async function askAANUSHASANAI(message) {
  try {

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are AANUSHASAN AI, an intelligent study mentor."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "AANUSHASAN AI",
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ AI RESPONSE RECEIVED");

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error(
      "❌ OPENROUTER ERROR:",
      error.response?.data || error.message
    );
    throw new Error("AI request failed");
  }
}

/* =====================================================
   SMART JSON EXTRACTOR ⭐ (MAIN FIX)
===================================================== */

function extractJSON(text) {

  if (!text) throw new Error("Empty AI response");

  // remove markdown
  text = text.replace(/```json/g, "")
             .replace(/```/g, "")
             .trim();

  // find JSON block safely
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1)
    throw new Error("JSON not found");

  return JSON.parse(text.substring(start, end + 1));
}

/* =====================================================
   STUDY STRATEGY AI
===================================================== */

async function generateStudyStrategyAI(studentData) {

  const prompt = `
Generate a personalised study strategy.

IMPORTANT:
Return VALID JSON ONLY.
No explanation text.

FORMAT:

{
 "overallStrategy":"text",

 "dailyRoutine":[
   {"time":"06:00","activity":"Study Maths","duration":"60m"}
 ],

 "subjectPriority":[
   {"subject":"Maths","hoursPerWeek":6,"technique":"Practice"}
 ],

 "weeklyMilestones":[
   "Finish Chapter 1"
 ],

 "examCountdown":[
   {"subject":"Maths","daysLeft":10,"urgency":"high"}
 ]
}

Student:
Name:${studentData.name}
DailyHours:${studentData.dailyHours}
Preferred:${studentData.preferredTime}
WeakAreas:${studentData.weakAreas}

Subjects:
${studentData.subjects
  .map(s => `${s.name} difficulty ${s.difficulty}`)
  .join("\n")}
`;

  const raw = await askAANUSHASANAI(prompt);

  console.log("RAW AI RESPONSE:\n", raw);

  try {
    return extractJSON(raw);
  } catch (err) {

    console.log("⚠ JSON parsing failed → fallback mode");

    return {
      overallStrategy: raw,
      dailyRoutine: [],
      subjectPriority: [],
      weeklyMilestones: [],
      examCountdown: []
    };
  }
}

/* =====================================================
   ANALYSIS AI
===================================================== */

async function analyzeStudyBehaviourAI(studentData) {

  const prompt = `
Analyze study behaviour.

CompletionRate:${studentData.completionRate}
Streak:${studentData.streak}
XP:${studentData.xp}
DailyHours:${studentData.dailyHours}
MissedTasks:${studentData.missedTasks}

Give:
- productivity level
- burnout risk
- improvement advice
`;

  return await askAANUSHASANAI(prompt);
}

/* ===================================================== */

module.exports = {
  askAANUSHASANAI,
  generateStudyStrategyAI,
  analyzeStudyBehaviourAI
};

function generateInsights(analyticsArr) {

  if (!analyticsArr?.length)
    return ["📚 Start studying to unlock AI insights"];

  const avg =
    analyticsArr.reduce(
      (s, a) =>
        s + a.completedHours /
        Math.max(a.plannedHours, 0.1),
      0
    ) / analyticsArr.length;

  if (avg < 0.5)
    return ["⚠️ Reduce workload slightly"];

  if (avg > 0.9)
    return ["🔥 Excellent discipline level"];

  return ["👍 Good consistency maintained"];
}