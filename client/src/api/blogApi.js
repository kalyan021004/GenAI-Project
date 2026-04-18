import api from "./baseApi";

export const getAllBlogs = (params) =>
  api.get("/api/blogs", { params }).then((r) => r.data);

export const getBlogById = (id) =>
  api.get(`/api/blogs/${id}`).then((r) => r.data);

export const createBlog = (formData) =>
  api.post("/api/blogs", formData)
    .then((r) => r.data);

export const deleteBlog = (id) =>
  api.delete(`/api/blogs/${id}`).then((r) => r.data);

export const updateBlog = (id, formData) =>
  api.put(`/api/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);