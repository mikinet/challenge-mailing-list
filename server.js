/**
 * APPLICATION: MAILING LIST "REST" API
 * */

const express = require("express");
const mailingList = require("./mailingList.json");
const app = express();

// create a mailing list
const lists = new Map();
// add some fake data
mailingList.forEach(addToList);

// ROUTES
// root (homepage)
app.get("/", (req, res) => {
  res.send("Welcome to my mailing list API!");
});

// fetch all the existing list names
app.get("/lists", (req, res) => {
  const listsArray = Array.from(lists.keys());
  res.status(200).send(listsArray);
});

// SUPPLEMENTARY FUNCTIONS
function addToList(item) {
  lists.set(item.name, item.members);
}

// LISTEN TO A PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT);