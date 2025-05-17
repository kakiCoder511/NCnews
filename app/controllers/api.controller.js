const { fetchApi, fetchTopics, fetchUsers } = require("../models/api.model");

exports.getApi = (req, res, next) => {
  fetchApi()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch(next);
};

exports.getTopics = (req, res, next) => {
  console.log("🐝GET /api/topics called");
  
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
