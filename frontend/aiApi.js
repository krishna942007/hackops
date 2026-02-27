import axios from "axios";

/* ===============================
   BASE API
=============================== */

const BASE = "http://localhost:5000/api/ai";

/* ===============================
   AI CHAT
=============================== */

export const sendChatMessage = async (message, userId) => {
  const res = await axios.post(`${BASE}/chat`, {
    message,
    userId
  });

  return res.data.reply;
};

/* ===============================
   AI ANALYSIS
=============================== */

export const analyseStudy = async (userId, extraData = {}) => {
  const res = await axios.post(`${BASE}/analyse`, {
    userId,
    ...extraData
  });

  return res.data;
};

/* ===============================
   ✅ AI STRATEGY (FINAL FIX)
=============================== */

export const getAIStrategy = async ({ userId, weakAreas = "" }) => {

  const res = await axios.post(`${BASE}/strategy`, {
    userId,
    weakAreas
  });

  return res.data;
};