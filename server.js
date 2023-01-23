const sdk = require('node-appwrite');

const express = require('express');
const { json } = require('express/lib/response');
const cors = require('cors');
// const res = require('express/lib/response');
//const axios = require('axios');
const bodyParser = require("body-parser");
const app = express();
  
app.use(bodyParser.json());
// app.use(express.static('assets'));
app.use(cors());


// Init SDK
const client = new sdk.Client();

client
    .setEndpoint('https://bf2a562.online-server.cloud/v1') // Replace this with your endpoint
    .setProject('63446724a6d27e696227') // Replace this with your projectID
    .setKey('07c14994a2e981137b93ac6d8b8531cded8541f5de329facf52ee8e578b45bfdf1ea644d6c42189d276915e30eae55d000f2d42c46ae970023a4198a9507b3f5c5402eb687577980fa626ab776646b7749305f72b1fc44f3c6dccf0d1960d132f52c21b36d126f66ec577c6b299f731fa30fad0e8512c35e652bfbefb81d2c2e') // Your secret API key
;

const database = new sdk.Databases(client, '63446ca755a041305f7f');
const users = new sdk.Users(client);

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: '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'
});
const openai = new OpenAIApi(configuration);

/* app.get('/', async (req, res) => {
    res.send("Hello openAI app");
}); */

app.post('/', async (req, res) => {
    try {
        //console.log(req.body);
        const pSearchstring = req.body.message;
        const pModel = req.body.model;
        const pTemperature = req.body.temperature;
        const pMax_tokens = req.body.max_tokens;

        const response = await openai.createCompletion({
            model: pModel,
            prompt: pSearchstring,
            max_tokens: parseInt(pMax_tokens),
            temperature: parseInt(pTemperature)
          });
          console.log(response.data);
          res.json(response.data)
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


async function getKeys() {
    try {
        const response = await axios.post('https://m.myapp2go.de/services/APIgetblz.php');
        const data = response.items;
        console.log(data);
        res.send(data);
    } catch (e) {
        console.log(e.message);
    }
}

//getKeys();

const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
    console.log(`App running on port ${ PORT }`);
});