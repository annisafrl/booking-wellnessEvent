require ("./config")
const express = require ("express");
const app = express();
const mongoose = require ("mongoose");
const {version} = require("./package.json");


const APIroutes = require("./routes");
const { runSeed } = require("./helper/runSeed");

const dbMongoString = process.env.dbMongoString
mongoose.connect(dbMongoString)
.then(res => {
    console.log("database connected.");
    runSeed()
}).catch(err => {
    console.log(err);
});

app.use(express.json()); // untuk post body jika tidak ada akan eror req.body

app.use("/api", APIroutes)

app.use(function(err, req, res, next){
    res.status(400).json({
        success: false,
        error: err.message || err
    })
});

//fefine port for backend
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}..`));