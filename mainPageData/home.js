const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird });
const dbCredentials = {
    user: process.env.user,
    password: process.env.password,
    host: process.env.host,
    port: process.env.port,
    database: process.env.database
};
const db = pgp(dbCredentials);

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let query = 'SELECT * FROM articles INNER JOIN base_urls ON base_url_id = baseurl_id';
    db.query(query)
      .then(function (rows) {
          let response = {
          statusCode: '200',
          body: JSON.stringify(manipulateData(rows)),
          headers: {
          'Content-Type': 'application/json',
        }
       };
       context.succeed(response);
      })
      .catch(function (error) {
        return callback(error);
      });
    
 };

 const manipulateData = function (data) {
    var final = [];
    var manipulated = {}
    data.forEach(function (record) {
      manipulated._id = record.article_id;
      manipulated.title = record.title;
      manipulated.domain = record.url;
      manipulated.baseUrl = record.base_url;
      manipulated.description = record.comment;
      manipulated.articleIsFakeNews = record.article_reliability;
      final.push(manipulated);
    });
  return final;
 }

