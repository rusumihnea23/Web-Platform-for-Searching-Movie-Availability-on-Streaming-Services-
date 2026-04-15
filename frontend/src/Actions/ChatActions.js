import api from "../Services/api";
const mainpath="/api/chat"

const askChatBot = async (prompt) => { 
  try {
    const res = await api.get(`${mainpath}/ask`, {
      params: {
        prompt: prompt // Removed the brackets []. Just pass the string.
      }
    });
    return res.data;
  } catch (err) {
    console.error("Chat Error:", err);
    alert(err.response?.data?.message || err.message);
  }
};
const getChatHistory = async () => { 
  try {
    const res = await api.get(`${mainpath}/history`, {
    });
    return res.data;
  } catch (err) {
    console.error("Chat Error:", err);
    alert(err.response?.data?.message || err.message);
  }
};
const deleteChat=async () => {
  try {
      const res = await api.patch(`${mainpath}/delete`
      );
    return res.data;
  } catch (err) {
    console.error(err);
     alert(err.response?.data?.message || err.message);
  }
};

export {askChatBot,deleteChat,getChatHistory};
