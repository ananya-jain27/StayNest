if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//connection build with mongoDB 
let dbUrl = process.env.ATLASDB_URL;

async function main(){
    // await mongoose.connect('mongodb://127.0.0.1:27017/staynest');
    await mongoose.connect(dbUrl);
}
main().then(() => {
    console.log("connection build");
})
.catch((err) => {
    console.log(err);
})

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner : "68cc0306eb5a833cce5d7f98"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDb();