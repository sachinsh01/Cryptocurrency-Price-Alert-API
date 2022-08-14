if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/users");
const alertRoutes = require("./routes/alerts");

const dbUrl = "mongodb://localhost:27017/Krypto-App" || process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error!"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/alerts", alertRoutes);


app.listen(3000, () => {
    console.log("Listening on port 3000.");
})



