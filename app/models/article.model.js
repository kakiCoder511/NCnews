const db = require("../../db/connection");

exports.fetchArticleByID = (article_id) => {
    return db
      .query(
        `SELECT * FROM articles 
      WHERE article_id = $1 `,
        [article_id]
      )
      .then((result) => {
        console.log("result.rows>>", result.rows);
        return result.rows[0];
      });
  };
  
  exports.fetchArticles = () => {
    return db.query(`
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
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;
  `
      )
      .then((result) => {
        return result.rows;
      });
  };

  exports.updateArticleVotes =(article_id, newVote)=>{
    return db.query(`
        UPDATE articles
        SET
        votes = votes + $1
        WHERE article_id =$2
        RETURNING *;
        `, [newVote, article_id]
    )
        .then((result)=>{
            console.log("articles vote",result.rows);
            
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article not found" });
            }
            return result.rows[0]
        })
  }
  