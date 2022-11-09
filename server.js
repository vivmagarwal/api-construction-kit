import dotenv from "dotenv";
dotenv.config();

import config from 'config';

import jsonServer from "json-server";
import path from "path";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ShortUniqueId from "short-unique-id";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uid = new ShortUniqueId({ length: 10 });

const file = path.join(__dirname, config.get('db'));
const adapter = new JSONFileSync(file);
const db = new LowSync(adapter);
// db.read();
// db.data.users.push({ three: "four" });
// db.write();

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, config.get('db')));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(express.static("public"));

// config
const protectedRoutes = [
  { route: "/users", methods: ["POST", "PUT", "DELETE", "PATCH"] },
  { route: "/posts", methods: ["POST", "PUT", "DELETE", "PATCH"] },
  { route: "/comments", methods: ["POST", "PUT", "DELETE", "PATCH"] },
  { route: "/photos", methods: ["POST", "PUT", "DELETE", "PATCH"] },
  { route: "/todos", methods: ["POST", "PUT", "DELETE", "PATCH"] },
  { route: "/recipeCategories", methods: ["POST", "PUT", "DELETE", "PATCH"] },
  { route: "/recipeIngredients", methods: ["POST", "PUT", "DELETE", "PATCH"] },
  { route: "/recipes", methods: ["POST", "PUT", "DELETE", "PATCH"] },
  { route: "/areas", methods: ["POST", "PUT", "DELETE", "PATCH"] },
  { route: "/recipeTags", methods: ["POST", "PUT", "DELETE", "PATCH"] },
  { route: "/orders", methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] },
];

// Authorization logic
server.use((req, res, next) => {
  let NeedsAuthorization = false;

  for (let i = 0; i < protectedRoutes.length; i++) {
    let { route, methods } = protectedRoutes[i];

    if (route === req.url) {
      if (methods.includes(req.method)) {
        NeedsAuthorization = true;
        break;
      }
    }
  }

  if (NeedsAuthorization) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!authHeader || !token)
      return res
        .status(403)
        .send(
          "Its a protected route/method. You need an auth token to access it."
        );

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res
          .status(403)
          .send("Some error occurred wile verifying token.");

      req.user = user;
      next();
    });
  } else {
    next();
  }
});

// default id & created at
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }

  if (req.method === "POST" && !req.body.id) {
    req.body.id = uid();
  }

  if (req.method === "POST" && req.user && !req.body.userId) {
    req.body.userId = req.user.id;
  }

  next();
});

// registration logic
server.post("/user/register", (req, res) => {
  if (
    !req.body ||
    !req.body.username ||
    !req.body.password ||
    !req.body.email
  ) {
    return res
      .status(400)
      .send("Bad request, requires username, password & email.");
  }

  db.read();
  const users = db.data.users;
  let largestId = 0;
  users.forEach((user) => {
    if (user.id > largestId) largestId = user.id;
  });

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const newId = largestId + 1;
  const newUserData = {
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
    firstname: req.body.firstname || "",
    lastname: req.body.lastname || "",
    avatar: req.body.avatar || "",
    createdAt: Date.now(),
    id: newId,
  };

  db.data.users.push(newUserData);

  db.write();

  res.status(201).send(newUserData);
});

// login/sign in logic
server.post("/user/login", (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    return res
      .status(400)
      .send("Bad request, requires username & password both.");
  }

  db.read();
  const users = db.data.users;
  const user = users.find((u) => u.username === req.body.username);
  if (user == null) {
    return res.status(400).send(`Cannot find user: ${req.body.username}`);
  }

  if (bcrypt.compareSync(req.body.password, user.password)) {
    // creating JWT token
    const accessToken = generateAccessToken(user);
    return res.send({
      accessToken: accessToken,
    });
  } else {
    res.send("Not allowed, name/password mismatch.");
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "6h" });
}

// To modify responses, overwrite router.render method:
// In this example, returned resources will be wrapped in a body property
// router.render = (req, res) => {
//   res.jsonp({
//     body: res.locals.data,
//   });
// };

server.use(router);


const PORT = process.env.NODE_ENV == 'development' ? `http://localhost:${config.get('port')}/` : `PORT: ${config.get('port')}`

server.listen(9999, () => {
  console.log(
    `JSON Server is running at ${PORT} in ${process.env.NODE_ENV} ENV.`
  );
});
