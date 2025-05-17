const express = require("express");
const app = express();
app.use(express.json());

const {
  getApi,
  getTopics,
  getUsers,
} = require("./app/controllers/api.controller");
const {
  getArticleByID,
  getArticles,
  patchArticleVotes,
} = require("./app/controllers/articles.controllers");
const {
  getComments,
  postComments,
} = require("./app/controllers/comments.controller");
const { deleteComment } = require("./app/controllers/comments.controller");

const {
  handleInvalidPath,
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./app/controllers/error.controller");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

//errorsHandler

app.all("/*splat", handleInvalidPath);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);
console.log("✅ Loaded app.js successfully");

module.exports = app;
