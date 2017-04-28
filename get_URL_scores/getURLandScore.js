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

const query = require('./sql_queries');

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    db.query(query.getUrlAndScore)
      .then(function (rows) {
        let response = {
          statusCode: '200',
          body: JSON.stringify(manipulateData(rows) ),
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
  const manipulatedData = {};
  data.forEach(function (record) {
     manipulatedData[record.base_url] = record.reliability;
  });
 return manipulatedData;
 };