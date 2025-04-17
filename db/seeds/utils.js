const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (articlesData) => {
  if(articlesData.length === 0){
  return {}
}
  
const result = {}
result[articlesData[0].title]=articlesData[0].article_id
return result
}


