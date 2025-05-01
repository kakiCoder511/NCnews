const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/comments.model");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      //console.log("📖comments",comments)
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  insertCommentByArticleId(article_id, username, body)
    .then((insertedComment) => {
      res.status(201).send({ comment: insertedComment });
    })
    .catch((err) => {
      if (err.code === "23503") {
        return next({ status: 404, msg: "User not found" });
      }
      next(err);
    });
};
