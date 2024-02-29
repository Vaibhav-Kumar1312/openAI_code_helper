require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const { Configuration, OpenAIApi } = require("openai");
const { OpenAI } = require("openai");

// const configuration = new Configuration({
//   apikey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  return res.status(200).send({
    message: "Hello from Code Helper",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    console.log("line--50", response.data);
    res.status(200).send({
      bot: response.data.choices[0].text,
    });

    // return res.status(200).send({
    //   bot: response.data.choices[0].text,
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error });
  }
});

app.listen(3000, () => console.log("Server is Running on port 3000"));
