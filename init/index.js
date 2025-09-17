const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//connection build with mongoDB 
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/staynest');
}
main().then(() => {
    console.log("connection build");
})
.catch((err) => {
    console.log(err);
})

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner : "68bfd2c0ac9ea66b07d87513"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDb();