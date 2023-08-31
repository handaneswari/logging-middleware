import express from "express";
import { Request, Response } from "express";
import { logMiddleware } from "./logMiddleware";
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const port = 3000;

app.use(logMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Define routes
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if(username.length > 6){
    res.redirect("/register-success");
  } else {
    // Render the registration page with an error message
    res.status(404).send("Username must be at least 6 characters long.");
  }
  }
);

app.get("/register-success", (req: Request, res: Response) => {
  res.send("Register success!");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the home page!");
});

app.get("/test", (req: Request, res: Response) => {
  res.status(200).send("This is the test page.");
});

app.get("/not-found", (req: Request, res: Response) => {
  res.status(404).send("Page not found.");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



