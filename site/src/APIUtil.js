const baseUrl = /*"https://www.api.scriptantiqua.com"*/"http://localhost:8000";

const Api = {
  async getAllWords() {
    const endpoint = baseUrl + "/words?";
    try {
      const response = await fetch(endpoint);

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  },

  async getAllFiles(){
    const endpoint = baseUrl + "/files?";
    try {
      const response = await fetch(endpoint);

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  },

  async post(object) {
    const endpoint = baseUrl + "/words";

    try {
      const data = JSON.stringify(object);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: data,
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  },

  async put(object) {
    const endpoint = baseUrl + "/words/" + object.id;

    try {
      const data = JSON.stringify(object);

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: data,
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  },

  async getAlgoResult(object) {
    const endpoint = baseUrl + "/getText";

    try {
      const data = JSON.stringify(object);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: data,
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  },

  async delete(object) {
    const endpoint = baseUrl + "/words/" + object.id;
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  },
};
