const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://luisfelipe:abc123ia@cristianoronaldo.x3nyw.mongodb.net/?retryWrites=true&w=majority&appName=CRISTIANORONALDO";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Conectando ao MongoDB com Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado ao MongoDB com Mongoose!"))
  .catch(err => console.error("Erro ao conectar ao MongoDB com Mongoose:", err));

// Definindo os esquemas do Mongoose
const mensagemSchema = new mongoose.Schema({
  mensagem: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isGPT: { type: Boolean, default: false }
});

const ipSchema = new mongoose.Schema({
  ip: { type: String, required: true },
});

// Criando os modelos
const Colecao = mongoose.model("AC", mensagemSchema);
const InternetProtocol = mongoose.model("DC", ipSchema);

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.post("/message", async (req, res) => {
  try {
    const { message, isGPT } = req.body;

    // Verificar se a mensagem está presente
    if (!message) {
      return res.status(400).json({ error: "O campo 'message' é obrigatório." });
    }

    const novaMensagem = new Colecao({ 
      mensagem: message, 
      isGPT: isGPT || false // Se isGPT não for fornecido, padrão será false
    });
    
    await novaMensagem.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    res.sendStatus(500);
  }
});

app.post("/acesso", async (req, res) => {
  try {
    const { ip } = req.body;

    // Verificar se o IP está presente
    if (!ip) {
      return res.status(400).json({ error: "O campo 'ip' é obrigatório." });
    }

    const novoIP = new InternetProtocol({ ip });
    await novoIP.save();
    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao salvar IP:", error);
    res.sendStatus(500);
  }
});

app.listen(6969, () => {
  console.log(`Professor Vagner é lindo!!!`);
});