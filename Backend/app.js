var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const crypto = require("crypto");
const passport = require('passport');
const session = require('express-session');
require("dotenv").config();
const cors = require("cors");
require("dotenv").config();
require("./utils/database");
const cron = require("node-cron");
const { Op } = require("sequelize");
const Task = require("./models/Task");
const User = require("./models/User");
const { transporter } = require("./utils/nodemailer"); 

const scheduleTaskDeadlineReminder = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log("⏰ Running daily task deadline check...");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);

    try {
      const tasksDueTomorrow = await Task.findAll({
        where: {
          deadline: {
            [Op.gte]: tomorrow,
            [Op.lt]: nextDay
          },
          is_completed: false
        },
        include: [{ model: User, attributes: ["email", "name"] }]
      });

      for (const task of tasksDueTomorrow) {
        const user = task.User;

        await transporter.sendMail({
          from: `PrioritiQ <${process.env.MAIL_USER}>`,
          to: user.email,
          subject: "⏰ Reminder: Task Deadline Tomorrow",
          html: `
            <p>Dear ${user.name},</p>
            <p>This is a reminder that your task <strong>"${task.title}"</strong> is due <strong>tomorrow</strong> (${task.deadline}).</p>
            <p>Please ensure it is completed on time.</p>
            <br/>
            <p>Best regards,<br/>PrioritiQ</p>
          `
        });

        console.log(`📧 Sent reminder to ${user.email} for task "${task.title}"`);
      }
    } catch (err) {
      console.error("❌ Failed to send deadline reminders:", err);
    }
  });
};

scheduleTaskDeadlineReminder();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes");


var AuthRouter = require("./routes/Auth");
var CategoryRouter = require("./routes/Category");
var TaskRouter = require("./routes/Task");


var app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(session({
  secret: 'akshdkashdquooaksXCVBNLWIQ0EQWEKLMlmkjwnsdjasnd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

function validateAPIKey(req, res, next) {
  const authkey = req.header('api-key');
  if (authkey && crypto.createHash('sha256').update(authkey).digest('hex') == process.env.API_KEY) {
    next();
  } else {
    res.status(401).send(`
      <html>
        <head>
          <title>Unauthorized Access</title>
          <style>
            body {
              background-color: #f8f8f8;
              font-family: Arial, sans-serif;
              color: #333;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .container {
              text-align: center;
              padding: 20px;
              background-color: #fff;
              border: 1px solid #ddd;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
            }
            .container h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            .container p {
              font-size: 16px;
              margin-bottom: 20px;
            }
            .container a {
              text-decoration: none;
              color: #007bff;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Unauthorized Access</h1>
            <p>You do not have permission to access this resource.</p>
            <p>Please contact the administrator if you believe this is an error.</p>
            <p><a href="/">Return to Home</a></p>
          </div>
        </body>
      </html>
    `);
  }
}

app.use((req, res, next) => {
  if (req.path.startsWith('/images')) {
    return next();
  }
  validateAPIKey(req, res, next);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("", usersRouter);

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/category", CategoryRouter);
app.use("/api/v1/task", TaskRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});



module.exports = app;
