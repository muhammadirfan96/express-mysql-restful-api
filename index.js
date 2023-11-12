const express = require("express");
const app = express();
const port = 3000;
const BooksRoute = require("./routes/BooksRoute");
const db = require("./config/database");

app.use(express.json());
app.use(BooksRoute);

db.authenticate()
  .then(() => console.log("connected to database ..."))
  .catch((err) => console.error(err));

app.listen(port, () => console.log(`app listen on port ${port} ...`));
