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
    console.log(event);
    const body = JSON.parse(event.body);
    const comment = body.comment;
    const articleId = body.articleId;
    const userId = body.userId;
    const connectingCommentId = body.connectingCommentId;
    // const connectingCommentId = querystring.parse(event.body.connectingCommentId);
    let query = 'INSERT INTO comments (comment, article_id, user_id, connecting_comment_id) VALUES ($1,$2,$3,$4)';
    
    db.query(query, [comment,articleId, userId, connectingCommentId])
      .then(function () {
        let response = {
          statusCode: 201,
          body: JSON.stringify({message:'Inserted a new comment'}),
          headers: {
          'Content-Type': 'application/json',
        }
       };
       
       callback(null,response);

           
      })
      .catch(function (error) {
        return callback(error);
      });
    
 };