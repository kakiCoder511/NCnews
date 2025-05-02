const endpoints = require("../../endpoints.json");
const db = require("../../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    return db
      .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
      .then((articleResult) => {
        
        if (articleResult.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Article not found" });
        }
        return db.query(
          `
          SELECT 
            comment_id,
            votes,
            created_at,
            author,
            body,
            article_id
          FROM comments
          WHERE article_id = $1
          ORDER BY created_at DESC
          `,
          [article_id]
        );
      })
      .then((commentsResult) => {
        return commentsResult.rows; 
      });
  };


exports.insertCommentByArticleId = (article_id, username, body)=>{
    const itemInsertStr =
    `INSERT INTO comments
    (body, author, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;`

    const insertedArrValue = [body, username, article_id]

    return db.query(itemInsertStr,insertedArrValue).then((result)=>{
        return result.rows[0]
    })
}