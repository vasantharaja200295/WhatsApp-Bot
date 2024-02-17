const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("remote_session_saved", () => {
  console.log("Session saved!");
});

client.on("ready", () => {
  console.log("Client is ready!");
});

let contacts = ["919629579216", "917010846735", "919962135365"];

client.on("message", async (message) => {
  if (contacts.includes(message.from.split("@")[0])) {
    const ans = await run(message.body);
    message.reply(ans);
  }
});

client.initialize();

async function run(prompt) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}
