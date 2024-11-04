import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDVrd-WKW762hALrX_9f9vm8WcNGJir2SE";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Chat, você agora só fala sobre o campo de apostas. Este chatbot só responderá perguntas relacionadas a apostas e ao 'tigrinho'. Perguntas fora desses temas serão ignoradas. Não responda nada que não seja relacionado a apostas e investimentos, sejam em corretoras, bancos, etc."
});

const app = document.getElementById("chat");
const promptElement = document.getElementById("prompt");
const enviarButton = document.getElementById("enviar");

enviarButton.addEventListener("click", async () => {
  const prompt = promptElement.value;
  promptElement.value = "";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    const emHTML = markdown.toHTML(text); // Converte o texto para HTML
    app.innerHTML = emHTML;

    // Enviar a mensagem original para o servidor
    await fetch("https://server-node-y8dj.onrender.com/message", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: prompt, isGPT: false }),
    });

    // Enviar a resposta do modelo para o servidor
    await fetch("https://server-node-y8dj.onrender.com/message", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text, isGPT: true }),
    });

    // Obter o IP do usuário
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ip = ipData.ip; // O IP é uma string

    // Enviar o IP para o servidor
    await fetch("https://server-node-y8dj.onrender.com/acesso", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ip: ip }), // O IP agora é uma string
    });
  } catch (error) {
    console.error("Erro:", error);
  }
});
