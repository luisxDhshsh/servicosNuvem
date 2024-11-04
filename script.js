import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyDVrd-WKW762hALrX_9f9vm8WcNGJir2SE";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction:"Chat, você agora só fala sobre o campo de apostas. Este chatbot só responderá perguntas relacionadas a apostas e ao 'tigrinho'. Perguntas fora desses temas serão ignoradas. Não responda nada que nao seja relacionado a apostas e investimentos, sejam em corretoras bancos, etc." });

const app = document.getElementById("chat");
const promptElement = document.getElementById("prompt");
const enviarButton = document.getElementById("enviar");

enviarButton.addEventListener("click", async () => {
  const prompt = promptElement.value;
  promptElement.value = "";
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  const emHTML = await markdown.toHTML(text);
  app.innerHTML = emHTML;
  fetch("https://server-node-y8dj.onrender.com/message", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: prompt, isGPT: false }),
  });
  fetch("https://server-node-y8dj.onrender.com/message", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: text, isGPT: true }),
  });
  let ip = fetch("https://api.ipify.org?format=json")
  .then((response) => response.json())
  .then((data) => {
    return data.ip;
  })
  .catch((error) => {
    console.log("Error:", error);
  });
  fetch("https://server-node-y8dj.onrender.com/acesso", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ip: ip }),
  });
});
