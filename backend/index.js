const express = require("express");
const snoowrap = require("snoowrap");
const bodyParser = require("body-parser");

const app = express();
const base64 = require("base-64");
const fetch = require("node-fetch");
const port = process.env.PORT || 5000;
if (process.env.NODE_ENV === "dev") {
  require("./config/config.js");
}

global.fetch = fetch;
global.Headers = fetch.Headers;

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("This is the index.js file");
});

app.post("/reddit/getaccesstoken", (req, res) => {
  let client = process.env.REACT_APP_CLIENTID;
  let secret = process.env.REACT_APP_CLIENTSECRET;
  let formatted = `${client}:${secret}`;
  let redirectUrl = req.body.redirecturl;
  let code = req.body.code;
  let redditApi = `https://www.reddit.com/api/v1/access_token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}`;
  console.log(redditApi);
  let headers = new Headers();
  headers.append("Authorization", `Basic ${base64.encode(formatted)}`);

  fetch(redditApi, {
    method: "POST",
    headers: headers
  })
    .then(res => res.json())
    .then(data => {
      if (
        typeof data.access_token !== "undefined" ||
        data.access_token !== null
      ) {
        res.json({ access_token: data.access_token });
        console.log(data);
      } else {
        res.status(400).send({ err: data });
        console.log(data);
      }
    });
});

app.post("/me/getsaved", (req, res) => {
  let characters = [];
  const user = new snoowrap({
    userAgent:
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
    clientId: process.env.REACT_APP_CLIENTID,
    clientSecret: process.env.REACT_APP_CLIENTSECRET,
    accessToken: req.body.accessToken
  });

  user
    .getMe()
    .getSavedContent()
    .fetchAll()
    .then(data => (posts = data))
    .then(() => {
      if (posts.length === 0)
        return res.status(400).send({ err: "No saved posts found" });
      let formattedPosts = [];
      for (let post of posts) {
        let formattedPost = {
          id: post.id,
          permalink: post.permalink,
          post_hint: post.post_hint,
          url: post.url,
          thumbnail: post.thumbnail,
          title: post.title,
          subreddit_name_prefixed: post.subreddit_name_prefixed
        };

        formattedPosts.push(formattedPost);
      }

      res.send({ posts: formattedPosts });
    });
});

app.listen(port, () => console.log("Server started on Port ", port));
