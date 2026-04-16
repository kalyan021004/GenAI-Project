// src/api/trailApi.js

import api from "./baseApi";

/*
   Trail API
   Uses centralized base URL
*/

export const generateTrail = (form) =>
  api
    .post("/api/trail/generate", form)
    .then((r) => r.data);