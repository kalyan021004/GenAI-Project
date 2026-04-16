// src/api/quizApi.js

import api from "./baseApi";

/*
   Quiz API
   Uses centralized base URL from baseApi.js
*/

export const generateQuiz = (
  site_name,
  site_context,
  count = 6
) =>
  api
    .post("/api/quiz/generate", {
      site_name,
      site_context,
      count
    })
    .then((r) => r.data);