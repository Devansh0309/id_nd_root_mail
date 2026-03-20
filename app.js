const express = require('express');
const { connectToDB } = require('./database/db');
const allRoutes = require("./routes/allRoutes")

const app = express();
const PORT = 8000;

allRoutes(app)

// app.listen(PORT, (error) =>{
//     if(!error)

//         console.log("Server is Successfully Running, and App is listening on port "+ PORT);
//     else 
//         console.log("Error occurred, server can't start", error);
//     }
// );


// Server
const startServer = async () => {
  // let dbConnected = false;
  app.listen(PORT, async () => {
    try {
      // dbConnected =
      await connectToDB().then(async (res) => {
        console.log("Connection to db successfull");
      });
      console.log(`Server is runnning on ${PORT}`);
    } catch (err) {
      console.log("Error: ", err);
    }
  });
};
startServer();