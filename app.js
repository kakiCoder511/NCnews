const express = require("express");
const app = express();
app.use(express.json());

const {
  getApi,
  getTopics,
  getUsers
} = require("./app/controllers/api.controller");
const {
  getArticleByID,
  getArticles,
  patchArticleVotes
} = require("./app/controllers/articles.controllers");
const {
  getComments,
  postComments,
} = require("./app/controllers/comments.controller");
const {
  deleteComment
} = require("./app/controllers/comments.controller")

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", patchArticleVotes)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", getUsers)

app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  console.log("🧯500 >>>>>>err", err);
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
