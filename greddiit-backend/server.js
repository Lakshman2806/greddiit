const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

//Routers
const userRouter = require("./routes/user");

const subgreddiitRouter = require("./routes/subgreddiits");

const postRouter = require("./routes/posts");

const reportRouter = require("./routes/report");

const conversationRouter = require("./routes/conversation");

// this is to parse the body of the request
app.use(express.json());


app.use(cors());

// for logging purposes
app.use((req, res, next) => {
  console.log("Middleware");
  console.log(req.path, req.method);
  // Why do we need this?
  // https://stackoverflow.com/questions/23259168/what-does-next-do-in-express-js-and-connect
  next();
});

//connect to mongodb
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("Connected to Db and listening on port", process.env.PORT);
    });
  })
  .catch((err) => console.log(err));



app.use("/api/user", userRouter);

app.use("/api/subgreddiits", subgreddiitRouter);

app.use("/api/posts", postRouter);

app.use("/api/report", reportRouter);

app.use("/api/conversation", conversationRouter);

app.get("/api", (req, res) => {
  res.send("Hello World");
});