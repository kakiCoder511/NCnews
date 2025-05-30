const endpoints = require("../../endpoints.json");
const db = require("../../db/connection");

exports.fetchApi = () => {
  return Promise.resolve(endpoints);
};

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.fetchUsers =()=>{
  return db.query(
  `SELECT * FROM users`
  ).then((result)=>{    
    return result.rows
  })
}