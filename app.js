const express = require('express');
const { connectToDB } = require('./database/db');

const app = express();
const PORT = 3000;

app.listen(PORT, (error) =>{
    if(!error)

        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);


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