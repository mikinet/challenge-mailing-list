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
    return res.sendStatus(204);
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
    return res.sendStatus(400); // it does not match
  }
  // if it matches...
  if (lists.has(name)) {
    // if the requested list exists, update its value
    addToList(incomingList);
    return res.sendStatus(200);
  }
  // otherwise create a new list
  addToList(incomingList);
  res.sendStatus(201);
});

// add a mailing list to the existing lists
function addToList(item) {
  lists.set(item.name, item.members);
}

/**** START OF "BONUS EXTENSION" CODE ****/

// get all emails for a single mailing list
app.get("/lists/:name/members", (req, res) => {
  const name = req.params.name;
  if (lists.has(name)) {
    const result = lists.get(name);
    return res.status(200).json(result);
  }
  res.sendStatus(404);
});

// add a supplied email to the list of e-mails in an existing mailing list
app.put("/lists/:name/members/:email", (req, res) => {
  const name = req.params.name;
  if (lists.has(name)) {
    // if the requested mailing list exists
    const incomingEmail = validateEmailAddress(req.params.email);
    if (incomingEmail) {
      // if the email is of valid format
      const list = lists.get(name);
      // determine if the supplied email exists in list
      const index = list.findIndex((email) => email === incomingEmail);
      if (index === -1) {
        list.push(incomingEmail); // if it does not, add it to the list
        return res.sendStatus(200);
      }
      return res.sendStatus(400); // send error if it does not
    }
    // otherwise, refuse to add email
    return res.sendStatus(400); // bad request
  }
  // if the requested mailing list does not exist
  res.sendStatus(404);
});

// remove a supplied email from the list of e-mails in an existing mailing list
app.delete("/lists/:name/members/:email", (req, res) => {
  const name = req.params.name;
  if (lists.has(name)) {
    // if the requested mailing list exists
    const incomingEmail = validateEmailAddress(req.params.email);
    if (incomingEmail) {
      // if the email is of valid format
      const list = lists.get(name);
      // determine if the supplied email exists in list
      const index = list.findIndex((email) => email === incomingEmail);
      if (index !== -1) {
        list.splice(index); // if it does, remove it from the list
        return res.sendStatus(204);
      }
      return res.sendStatus(404); // send error if it does not
    }
    // if incomingEmail is of incorrect format
    return res.sendStatus(400); // bad request
  }
  // if the requested mailing list does not exist
  res.sendStatus(404);
});

// validate an email address
function validateEmailAddress(text) {
  return text.includes("@") ? text : "";
}

/**** END OF "BONUS EXTENSION" CODE ****/

// LISTEN TO A PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT);
