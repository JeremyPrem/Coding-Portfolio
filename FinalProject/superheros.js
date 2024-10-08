const path = require("path");
const express = require("express"); 
const app = express();
const http = require("http");
const fs = require("fs");
const axios = require('axios');
let args = process.argv;
let portNumber;
if(args.length != 3){
    portNumber = 4000;
} else {
    portNumber = args[2];
}

const bodyParser = require('body-parser');
require("dotenv").config();
require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') })
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};
const { MongoClient, ServerApiVersion } = require('mongodb');

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

const uri = `mongodb+srv://${userName}:${password}@cluster0.4cayekw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const db = process.env.MONGO_DB_NAME;
const coll = process.env.MONGO_COLLECTION;

app.get("/", (request, response) => {
    response.render('index');
});

app.get("/userData", (request, response) =>{
    response.render('userData')
});

app.post("/userData", async (request, response) =>{
    try {
        await client.connect();
        let data = {
            name: request.body.name,
            first:request.body.first,
            second: request.body.second,
            third: request.body.third  
        }
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(data);
      } catch (err) {
        console.error(err);
        response.status(500).send('An error occurred while submitting the form.');
      } finally {
        await client.close(); 
      }
      let data = {
        name: request.body.name,
        first:request.body.first,
        second: request.body.second,
        third: request.body.third, 
    }
    response.render("displayFavorites", data);
});

app.get("/getFavs", (request, response) =>{
    response.render('getFavs')
});

app.post("/getFavs", async (request, response) => {
    let data = {name: request.body.name};
    try {
        await client.connect();
        const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).findOne(data);
        if (result){
            let data = {
                name: result.name,
                first: result.first,
                second: result.second,
                third: result.third, 
            }
            const options1 = {
                method: 'GET',
                url: 'https://superhero-search.p.rapidapi.com/api/',
                params: {hero: result.first},
                headers: {
                  'X-RapidAPI-Key': '05ea450b42msh25e4183f6ef36c4p1c1594jsn299a51e8e4bf',
                  'X-RapidAPI-Host': 'superhero-search.p.rapidapi.com'
                }
              };
              const res1 = await axios.request(options1);
              const image1 = res1.data.images.lg;
              
              const options2 = {
                method: 'GET',
                url: 'https://superhero-search.p.rapidapi.com/api/',
                params: {hero: result.second},
                headers: {
                  'X-RapidAPI-Key': '05ea450b42msh25e4183f6ef36c4p1c1594jsn299a51e8e4bf',
                  'X-RapidAPI-Host': 'superhero-search.p.rapidapi.com'
                }
              };
              const res2 = await axios.request(options2);
              const image2 = res2.data.images.lg;

              const options3 = {
                method: 'GET',
                url: 'https://superhero-search.p.rapidapi.com/api/',
                params: {hero: result.third},
                headers: {
                  'X-RapidAPI-Key': '05ea450b42msh25e4183f6ef36c4p1c1594jsn299a51e8e4bf',
                  'X-RapidAPI-Host': 'superhero-search.p.rapidapi.com'
                }
              };
              const res3 = await axios.request(options3);
              const image3 = res3.data.images.lg;
              let dataPrime = {
                name: result.name,
                first: result.first,
                second: result.second,
                third: result.third,
                image1: image1,
                image2: image2,
                image3: image3, 
            }
            //console.log(image1);
            //console.log(image2);
            response.render("displayFavorites", dataPrime);
        } else {
            let data = {
                name: "NONE",
                first:"NONE",
                second: "NONE",
                third: "NONE", 
            }
            response.render("displayFavorites", data);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close(); 
    }
});

app.get("/randomFav", (request, response) =>{
    response.render('randomFav')
});

app.post("/randomFav", async (request, response) =>{
    try {
        await client.connect();
        const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).aggregate([{ $sample: { size: 1 } }]).toArray();
        const arr = [result[0].first, result[0].second, result[0].third];
        const randomIndex = Math.floor(Math.random() * 3);
        const randomElement = arr[randomIndex];
        const userName = result[0].name;
        const options = {
            method: 'GET',
            url: 'https://superhero-search.p.rapidapi.com/api/',
            params: {hero: randomElement},
            headers: {
              'X-RapidAPI-Key': '05ea450b42msh25e4183f6ef36c4p1c1594jsn299a51e8e4bf',
              'X-RapidAPI-Host': 'superhero-search.p.rapidapi.com'
            }
          };
              const res = await axios.request(options);
              const heroData = res.data;
              const image = heroData.images.lg;
              //console.log(connections);
              //console.log(heroData.appearance);
              let fields = {
                user: userName,
                xthHero: randomIndex,
                name: heroData.name,
                stats: heroData.powerstats,
                appearance: heroData.appearance,
                groups: heroData.connections.groupAffiliation,
                family: heroData.connections.relatives,
                imageUrl: image,
              }
              //console.log(fields);
              response.render("showRandomFav", fields);
    } catch (err) {
        console.error(err);
        response.status(500).send('An error occurred while submitting the form.');
      } finally {
        await client.close(); 
      }
});

app.get("/allFavs", (request, response) =>{
    response.render('allFavs')
});

app.post("/allFavs", async (request, response) =>{
    try {
        await client.connect();
        const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).find().toArray();
        const newArray = result.map(obj => ({ first: obj.first, second: obj.second, third: obj.third })).flatMap(obj => Object.values(obj)).sort();
        const countMap = newArray.reduce((map, string) => {
            map.set(string, (map.get(string) || 0) + 1);
            return map;
        }, new Map());
        const labels = Array.from(countMap.keys());
        const data = Array.from(countMap.values());
        let vars = {
          map: countMap,
          labels: labels,
          data: data,
        };
        response.render("displayGraph", vars);
        console.log(labels);
    } catch (err) {
        console.error(err);
        response.status(500).send('An error occurred while submitting the form.');
    } finally {
        await client.close(); 
    }
});

app.listen(portNumber);
process.stdin.setEncoding("utf8");
console.log(`Web server is running at http://localhost:${portNumber}`);
const prompt = "Type stop to shutdown the server: ";
console.log(prompt);
process.stdin.on("readable", function () {
	let dataInput = process.stdin.read();
	if (dataInput !== null) {
	  let command = dataInput.trim();
	  if (command === "stop") {
		process.stdout.write("Shutting down the server\n");
		process.exit(0);
	  } else {
		console.log(`Invalid command: ${command}`);  
	  }
	  process.stdin.resume();
	  process.stdout.write(prompt);
	}
  });