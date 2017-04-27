var request = require("request");

module.exports.longLink = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  request(
    { method: "HEAD", url: event.shortUrl, followAllRedirects: true },
    (error, response) => {
      if (error) callback(JSON.stringify({ error: error }));
      callback(null, JSON.stringify({ longUrl: response.request.href }));
    }
  );
};

/*
POST request format in JSON:
{
  "shortUrl": "the_shortened_url_with_protocol"
}
*/