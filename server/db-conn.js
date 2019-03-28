const mongoose = require("mongoose");

const { DB_CONN, DB_USER, DB_PW } = process.env;

mongoose
  .connect(DB_CONN, {
    auth: {
      user: `${DB_USER}`,
      password: `${DB_PW}`
    },
    useNewUrlParser: true
  })
  .then(() => console.log("Connection to CosmosDB successful"))
  .catch(err => console.error(err.errors));

mongoose.set("useFindAndModify", false);
