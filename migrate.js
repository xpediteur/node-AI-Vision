const sdk = require('node-appwrite');
const express = require('express')
const axios = require('axios')
const app = express()


//Init SDK
const client = new sdk.Client();


client
    .setEndpoint('https://bf2a562.online-server.cloud/v1') // Replace this with your endpoint
    .setProject('63446724a6d27e696227') // Replace this with your projectID
    .setKey('blabla123xyz') // Your secret API key
;

const database = new sdk.Databases(client, '63446ca755a041305f7f');

app.get("/", async(req, res) => {
    try {
        const response = await axios.get("https://m.myapp2go.de/services/API_get_keys")
        res.json(response.data)
    } catch (err) {
        console.log(err)
    }
})

app.get('/api/keys', async(req, res) => {
    let data = await database.listDocuments('63446ca755a041305f7f', '635256b413c28b9de0c8');
    res.send(data.documents);
    console.log('api/customer called!', data)
})

async function getKeys() {
    try {
        const response = await axios.get('https://m.myapp2go.de/services/API_get_keys');
        const data = response.data.items.map(value => ({

            KY_KEY: value.KY_KEY,
            KY_VALUE: value.KY_VALUE,
            KY_TEXT: value.KY_TEXT

        }));
        console.log("mapped in array: ", data);

        return data;
        //res.send(data);
    } catch (e) {
        console.log(e.message);
    }
}

async function migrateDatabase() {
    try {
        const migKeys = await getKeys(); // get a key-array with map from getKeys()
        migKeys.forEach(async(element) => {
            try {
                console.log("key array ID --> : ", element.KY_KEY, element.KY_VALUE, element.KY_TEXT);
                await database.createDocument('63446ca755a041305f7f', '635256b413c28b9de0c8', 'unique()', {

                    'KY_KEY': element.KY_KEY,
                    'KY_VALUE': element.KY_VALUE,
                    'KY_TEXT': element.KY_TEXT

                })

            } catch (e) {
                console.log(e.message)
            }
        });
    } catch (e) {
        console.log(e.message);
    }
}

(async() => {
    await getKeys();
})();

app.get('*', (req, res) => {
    res.status(500).json({ message: "error" })
})

app.listen(3080) // or other ports