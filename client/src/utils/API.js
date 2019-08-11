import axios from "axios";

export default {
  googleSeed: function() {
    return axios.get("/api/google/seed");
  },
  // Gets the book with the given id
  getNotes: async function(id) {

  },
  // Deletes the book with the given id
  deleteBook: function(id) {
    return axios.delete("/api/books/" + id);
  },
  // Saves a book to the database
  saveBook: function(bookData) {
    return axios.post("/api/books", bookData);
  }
};


/* 
loadNotes = async () => {
    try {
      const token = await getTokenSilently();
      console.log('TOKEN: ' + token);
      const response = await fetch("/api/notes/get", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("ran GetNotes")
      const responseData = await response.json();

      console.log(responseData)

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  }; */