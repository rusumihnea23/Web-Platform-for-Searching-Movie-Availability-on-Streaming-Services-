import api from "../Services/api";
const mainpath = "/api/list";

const createMovieList = async (movieListData) => {
  try {
    const res = await api.post(`${mainpath}`, movieListData);
    
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};

const getUserListsSparse = async () => {
  try {
    const res = await api.get(`${mainpath}/sparse`);
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const getUserListsDetailed = async () => {
  try {
    const res = await api.get(`${mainpath}/detailed`);
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const getSingleList = async (id) => {
  try {
    const res = await api.get(`${mainpath}/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const updateListDetails = async (id, updateData) => {
  try {
    const res = await api.put(`${mainpath}/${id}`, updateData);
    
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};

const deleteList = async (id) => {
  try {
    await api.delete(`${mainpath}/${id}`);
   
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const addMovieToList = async (listId, movieId) => {
  try {
    const res = await api.post(`${mainpath}/${listId}/movies/${movieId}`);
    
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const removeMovieFromList = async (listId, movieId) => {
  try {
    const res = await api.delete(`${mainpath}/${listId}/movies/${movieId}`);
   
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const getPublicUserLists = async (userId) => {
  try {
    const res = await api.get(`${mainpath}/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getPublicSingleList = async (listId) => {
  try {
    // Note: your controller uses "/lists/{listId}" for the public route
    const res = await api.get(`${mainpath}/lists/${listId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getAllLists = async (name = "", sortBy = "popular") => {
  try {
    // We use axios (api) params to construct: /api/list/public?name=...&sortBy=...
    const res = await api.get(`${mainpath}/public`, {
      params: { name, sortBy }
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const likeList = async (listId) => {
  try {
    // Note: your controller uses "/lists/{listId}" for the public route
    const res = await api.post(`${mainpath}/${listId}/like`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
const getLikedLists = async () => {
  try {
    // Note: your controller uses "/lists/{listId}" for the public route
    const res = await api.get(`${mainpath}/me/liked`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export {
  createMovieList,
  getUserListsSparse,
  getUserListsDetailed,
  getSingleList,
  updateListDetails,
  deleteList,
  addMovieToList,
  removeMovieFromList,
  getPublicUserLists,
  getPublicSingleList,
  getAllLists,
  likeList,
  getLikedLists
};