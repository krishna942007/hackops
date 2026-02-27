require('dotenv').config();
const https = require('https');

async function callAI(prompt) {
  const body = JSON.stringify({
model: 'meta-llama/llama-3.3-70b-instruct:free',
    messages: [{ role: 'user', content: prompt }],
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const text = json.choices?.[0]?.message?.content;
          if (!text) return reject(new Error(JSON.stringify(json)));
          resolve(text);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function chatWithAI(userMessage, studentContext) {
  const prompt = `
You are AANUSHASAN AI — a wise, disciplined academic advisor 
combining ancient Indian wisdom with modern AI intelligence.

Student Profile:
- Name: ${studentContext.name}
- Subjects: ${studentContext.subjects.map(s => s.name).join(', ')}
- Daily Study Hours: ${studentContext.dailyHours}h
- Current Streak: ${studentContext.streak} days
- Level: ${studentContext.level}
- XP: ${studentContext.xp}

Student's Question: ${userMessage}

Reply in a motivating, wise tone. Keep it concise (3-5 sentences max).
Reference their actual data when relevant.
  `;
  return await callAI(prompt);
}

async function analyzeStudyBehaviour(studentData) {
  const prompt = `
You are an expert academic performance analyst.
Analyze this student's study data and provide deep insights.

Student: ${studentData.name}
Subjects: ${JSON.stringify(studentData.subjects)}
Completion Rate Today: ${studentData.completionRate}%
Current Streak: ${studentData.streak} days
XP: ${studentData.xp}, Level: ${studentData.level}
Study Hours Per Day: ${studentData.dailyHours}
Missed Tasks: ${studentData.missedTasks}

Respond ONLY with this JSON, no extra text:
{
  "overallScore": 75,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "burnoutRisk": "low",
  "burnoutReason": "one sentence reason",
  "weeklyStrategy": ["action 1", "action 2", "action 3", "action 4", "action 5"],
  "subjectFocus": "which subject needs attention and why",
  "motivationalMessage": "personalized 2 sentence message"
}
  `;
  const text = await callAI(prompt);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  throw new Error('Could not parse AI response');
}

async function generateStudyStrategy(studentData) {
  const prompt = `
You are a master study strategist.
Create a personalized study strategy for this student.

Name: ${studentData.name}
Subjects: ${JSON.stringify(studentData.subjects)}
Daily Available Hours: ${studentData.dailyHours}
Preferred Time: ${studentData.preferredTime}
Weak Areas: ${studentData.weakAreas || 'Not specified'}

Respond ONLY with this JSON, no extra text:
{
  "strategy": "overall approach in 3 sentences",
  "dailyRoutine": [
    { "time": "6:00 AM", "activity": "what to do", "duration": "30 mins" }
  ],
  "subjectPriority": [
    { "subject": "name", "hoursPerWeek": 5, "technique": "study technique" }
  ],
  "weeklyMilestones": ["goal 1", "goal 2", "goal 3", "goal 4"],
  "examCountdown": [
    { "subject": "name", "daysLeft": 10, "urgency": "high" }
  ],
  "ancientWisdom": "one Sanskrit proverb relevant to their situation"
}
  `;
  const text = await callAI(prompt);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  throw new Error('Could not parse AI response');
}

module.exports = { chatWithAI, analyzeStudyBehaviour, generateStudyStrategy };