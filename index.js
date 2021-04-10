const express = require("express");
const app = express();
const database = require("./database/db.config");
const cors = require("cors");
const storyRouter = require("./route/StoryRoute/storyRoute");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

database.connect((err) => {
  err ? console.log(err) : console.log("connected database");
});

app.use(express.static(__dirname + "/fileStorage/"));

app.use("/api/v1/", storyRouter);

app.listen(4000, () => {
  try {
    console.log("server is running sucessfully!");
  } catch (error) {
    console.log(error);
  }
});
