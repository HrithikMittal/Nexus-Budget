var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session")
const db = require("./app/mongoose.js")
const MongoStore = require("connect-mongo")(session)
var Budget = require("./app/models/budget");
var Admin  = require("./app/models/adminModel");
const { isAdminLoggedIn } = require("./app/middleware/auth.js")
const { check, validationResult } = require("express-validator/check");

// Configure app for bodyParser()
// lets us grab data from the body of POST
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

// Set up port for server to listen on
var port = process.env.PORT || 3004;

var router = express.Router();

//setup express-session middleware
app.use(session({
  secret: 'Xy12MIeRt Un2aDs',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    expires: new Date(Date.now() + 60 * 60 * 1000)
  },
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// Routes will all be prefixed with /API
app.use("/api", router);

//MIDDLE WARE-
router.use(function (req, res, next) {
  console.log("FYI...There is some processing currently going down");
  next();
});

// test route
router.get("/", function (req, res) {
  res.json({
    message: "Welcome !"
  });
});

router.post("/login", [
  check("id").not().isEmpty().withMessage("Please provide login id.").trim().escape(),
  check("password").not().isEmpty().withMessage("Please provide login password.").trim().escape(),
], async (req, res) => {
  try {
  if(req.session.admin) {
    return res.json({ message: "Already Logged In!"})
  }

  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return res.status(400).send({ message: "Bad Request!", error: errors.array()})
  }

  const admin = await Admin.findOne({ id: req.body.id, password: req.body.password })

  if(!admin){
    return res.json({ error: "Incorrect id or password!" })
  }

  req.session.admin = admin
  res.status(200).send({ success: "Admin Logged In!"})

  } catch(e) {
    res.status(400).send({ message: "Bad Request!", error: e})
  }
})

router.get("/logout", (req, res) => {
  req.session.destroy()
  res.status(200).send({ success: "Logged out!"})
})

// code for ledger
router.route("/budget").post(async function (req, res) {

    var budgetNew = new Budget();
    budgetNew.budgetMonth = req.body.budgetMonth;
    budgetNew.openingStock = req.body.openingStock;
    budgetNew.clossingStock = req.body.clossingStock;
    budgetNew.cashSales = req.body.cashSales;
    budgetNew.recievedOfDebators = req.body.recievedOfDebators;
    budgetNew.dividends = req.body.dividends;
    budgetNew.interest = req.body.interest;
    budgetNew.saleOfFixedAsset = req.body.saleOfFixedAsset;
    budgetNew.saleOfShares = req.body.saleOfShares;
    budgetNew.borrowing = req.body.borrowing;
    budgetNew.saleOfInvestments = req.body.saleOfInvestments;
    budgetNew.payementToCreditors = req.body.payementToCreditors;
    budgetNew.payementOfWages = req.body.payementOfWages;
    budgetNew.payementOfExpenses = req.body.payementOfExpenses;
    budgetNew.payementOfDividend = req.body.payementOfDividend;
    budgetNew.payementOfFixedAssets = req.body.payementOfFixedAssests;
    budgetNew.payementOfTax = req.body.payementOfTax;
    budgetNew.payementOfBonus = req.body.payementOfBonus;

    await budgetNew.save()

    res.send({ success: "Budget inserted successfully!"})
});

router.route("/budgetList").get(async function (req, res) {
  const budgets = await Budget.find()

  res.send({ budgets })
})

// Fire up server
app.listen(port);

// print friendly message to console
console.log("Server listening on port " + port);