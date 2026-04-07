import api from "../Services/api";
const mainpath = "/api/list";

const createMovieList = async (movieListData) => {
  try {
    const res = await api.post(`${mainpath}`, movieListData);
    alert("List created successfully!");
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
    alert("List updated successfully");
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};

const deleteList = async (id) => {
  try {
    await api.delete(`${mainpath}/${id}`);
    alert("List deleted successfully");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const addMovieToList = async (listId, movieId) => {
  try {
    const res = await api.post(`${mainpath}/${listId}/movies/${movieId}`);
    alert("Movie added to list successfully");
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
  }
};


const removeMovieFromList = async (listId, movieId) => {
  try {
    const res = await api.delete(`${mainpath}/${listId}/movies/${movieId}`);
    alert("Movie removed from list successfully");
    return res.data;
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message);
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
  removeMovieFromList
};