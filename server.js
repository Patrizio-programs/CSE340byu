/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const Util = require("./utilities");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const accountController = require("./controllers/accountController");
const inventoryController = require("./controllers/invController");
const session = require("express-session");
const pool = require("./database/");
const utilities = require("./utilities");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

/* ***********************
 * Views /Templates

 *************************/

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

// Static files middleware
app.use(express.static("public"));

// Routes
app.use(static);
app.get("/", baseController.buildHome);

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes
app.use("/account", accountRoute);

/* ***********************
 * Middleware
 * ************************/
// Body parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser Middleware
app.use(cookieParser());

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

app.use(flash());

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(utilities.checkJWTToken);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/

const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/

app.listen(port, host || "0.0.0.0", () => {
  console.log(`app listening on ${host || "0.0.0.0"}:${port}`);
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await Util.getNav(req, res);
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.render("errors/errors", {
    title: err.status || "Server Error",
    message: err.message,
    error: err,
    nav,
  });
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});
