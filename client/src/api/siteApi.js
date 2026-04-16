// src/api/sitesApi.js

import api from "./baseApi";

/*
   BASE path only
   base URL comes from baseApi.js
*/

const BASE = "/api/sites";

export const searchSites = (q) =>
  api.get(`${BASE}/search`, {
    params: { q }
  }).then((r) => r.data);

export const getSiteBySlug = (slug) =>
  api.get(`${BASE}/${slug}`)
     .then((r) => r.data);

export const getAllSites = () =>
  api.get(`${BASE}/all`)
     .then((r) => r.data);

export const generateSite = (place_name) =>
  api.post(`${BASE}/generate`, {
    place_name
  }).then((r) => r.data);

export const getSitesByState = (state) =>
  api.get(`${BASE}/bystate`, {
    params: { state }
  }).then((r) => r.data);

export const getSiteSection = (slug, section) =>
  api.get(`${BASE}/${slug}/${section}`)
     .then((r) => r.data);