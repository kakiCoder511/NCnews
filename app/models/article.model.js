const db = require("../../db/connection");

exports.fetchArticleByID = (article_id) => {
  return db
    .query(
      `SELECT 
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.article_img_url,
      (
      SELECT COUNT(*)
      FROM comments
      WHERE comments.article_id=articles.article_id
      ) AS comment_count
      
      
      FROM articles

      WHERE article_id = $1 `,
      [article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.fetchArticles = ({ sort_by = "created_at", order = "desc" ,topic} = {}) => {
  const validSortBy = [
    "title",
    "votes",
    "author", 
    "created_at",
    "article_id", 
    "topic", 
    "article_img_url", 
    "comment_count"
  ];
  const validOrder = ["asc", "desc"];

  if (typeof order === "string") order = order.toLowerCase();
  if (typeof sort_by === "string") sort_by = sort_by.toLowerCase();

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryParams = [];
  let queryStr = `
    SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments 
    ON comments.article_id = articles.article_id
  `;

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
  `;

  //  handle topic validation + article query
  if (topic) {
    return db.query("SELECT * FROM topics WHERE slug = $1", [topic])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Topic not found" });
        }
        return db.query(queryStr, queryParams);
      })
      .then((result) => result.rows);
  }

  // no topic, just query
  return db.query(queryStr).then((result) => result.rows);
};


exports.updateArticleVotes = (article_id, newVote) => {
  return db
    .query(
      `
        UPDATE articles
        SET
        votes = votes + $1
        WHERE article_id =$2
        RETURNING *;
        `,
      [newVote, article_id]
    )
    .then((result) => {
      console.log("articles vote", result.rows);

      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rows[0];
    });
};
 