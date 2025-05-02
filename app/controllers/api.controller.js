const { fetchApi, fetchTopics } = require("../models/api.model");

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
