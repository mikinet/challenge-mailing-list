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

// get a single list
app.get("/lists/:name", (req, res) => {
  const name = req.params.name;
  if (lists.has(name)) {
    const result = { name: name, members: lists.get(name) };
    return res.status(200).json(result);
  }
  res.sendStatus(404);
});

// delete a single list
app.delete("/lists/:name", (req, res) => {
  const name = req.params.name;
  if (lists.has(name)) {
    lists.delete(name);
    return res.status(204);
  }
  res.sendStatus(404);
});

// update a single list
app.use(express.json()); // restrict the received data format to JSON
app.put("/lists/:name", (req, res) => {
  const name = req.params.name;
  const incomingList = req.body;
  
  // check if "name" value in the request body matches to the parameter's value
  if (name !== incomingList.name) {
    return res.sendStatus(400); // bad request
  }

  if (lists.has(name)) {
    // if the requested list exists, update its value
    const list = lists.get(name);
    list.name = req.body.name;
    return res.status(200);
  }
  // otherwise create a new list
  addToList(req.body);
  res.sendStatus(201);
});

// add a mailing list to the existing lists
function addToList(item) {
  lists.set(item.name, item.members);
}

// LISTEN TO A PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT);