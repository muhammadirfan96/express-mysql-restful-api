const express = require("express");
const app = express();
const port = 3000;
const BooksRoute = require("./routes/BooksRoute");
const UserRoute = require("./routes/UsersRoute");
const db = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(BooksRoute);
app.use(UserRoute);

db.authenticate()
  .then(() => console.log("connected to database ..."))
  .catch((err) => console.error(err));

app.listen(port, () => console.log(`app listen on port ${port} ...`));
