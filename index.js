require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const API_KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

const app = express();
app.use(formidable());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Tripadvisor server" });
});

app.post("/form", async (req, res) => {
  console.log(req.fields);

  const data = {
    from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
    to: `${process.env.EMAIL}`,
    subject: req.fields.subject,
    text: req.fields.message,
  };

  try {
    await mailgun.messages().send(data);
    res.status(200).json({
      message:
        "Merci pour votre participation. Nous avons bien reçu votre message.",
    });
  } catch (error) {
    res.status(400).json({ error: "An error occurred" });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found !" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
