const {
  fetchArticleByID,
  fetchArticles,
  updateArticleVotes,
} = require("../models/article.model");

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleByID(article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.getArticles = (req, res, next) => {
  const{topic,sort_by, order} = req.query

  fetchArticles({topic,sort_by, order})
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  
  if (typeof inc_votes !== "number") {
    return next({ status: 400, msg: "Invalid inc_votes value" });
  }

  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};
