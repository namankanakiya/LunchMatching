const mongoose = require("mongoose");

const { DB_CONN, DB_USER, DB_PW } = process.env;

mongoose
  .connect(DB_CONN + "?ssl=true&replicaSet=globaldb", {
    auth: {
      user: DB_USER,
      password: DB_PW
    }
  })
  .then(() => console.log("Connection to CosmosDB successful"))
  .catch(err => console.error(err));
