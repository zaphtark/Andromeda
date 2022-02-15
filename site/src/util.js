const baseUrl = "https://www.api.scriptantiqua.com";

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

function createElementFromText(type, text) {
  const element = document.createElement(type);
  element.innerHTML = text;
  return element;
}

function createRowFromElements(elements, header = false) {
  const row = document.createElement("tr");
  for (let element of elements) {
    const data = document.createElement(header ? "th" : "td");
    data.appendChild(element);
    row.appendChild(data);
  }
  return row;
}

function createButton(fn, text, value = null) {
  const button = createElementFromText("button", text);
  button.setAttribute("value", value);
  button.addEventListener("click", fn);
  return button;
}

function createInput(value = "", id = null) {
  const input = document.createElement("input");
  if (value) {
    input.setAttribute("value", value);
  }
  if (id) {
    input.setAttribute("id", id);
  }
  return input;
}

function docReady(fn) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

function cleanRatio(ratio){
  return (ratio * 100).toFixed(3) + "%";
}