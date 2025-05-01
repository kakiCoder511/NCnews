const { fetchApi, fetchTopics, fetchArticleByID,fetchArticles } = require("../models/api.model");

exports.getApi = (req, res, next) => {
  fetchApi()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch(next);
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
    
};

exports.getArticleByID =(req, res, next) =>{
    const {article_id} =req.params
    fetchArticleByID(article_id)
    .then((article)=>{
        if(!article){
            return Promise.reject({status:404, msg:"Article not found"})
        } 
        res.status(200).send({article})
    })
    .catch(next)
}
exports.getArticles =(req,res,next)=>{
  fetchArticles()
  .then((articles)=>{
    res.status(200).send({articles})
  })
  .catch(next)
}

