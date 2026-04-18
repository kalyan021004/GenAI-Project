import api from "./baseApi";
/* ================================
   GET BLOG POSTS (WITH FILTERS)
================================ */
export const getBlogs = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();

    const res = await api.get(`/blog?${query}`);

    return res.data.posts || res.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

/* ================================
   CREATE BLOG POST
================================ */
export const createBlog = async (formData) => {
  try {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    const res = await api.post("/create", data);

    return res.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

/* ================================
   DELETE BLOG
================================ */
export const deleteBlog = async (id) => {
  try {
    const res = await api.delete(`/blog/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

/* ================================
   UPDATE BLOG
================================ */
export const updateBlog = async (id, formData) => {
  try {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    const res = await api.put(`/blog/${id}`, data);

    return res.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

/* ================================
   GET SINGLE BLOG
================================ */
export const getSingleBlog = async (id) => {
  try {
    const res = await api.get(`/blog/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};