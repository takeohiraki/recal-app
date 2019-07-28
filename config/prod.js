// prod.js - production keys here!!
module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  slackToken: process.env.SLACK_TOKEN,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  auth0Client: process.env.AUTH0_CLIENT_ID,
  auth0Domain: process.env.AUTH0_DOMAIN,
  auth0Secret: process.env.AUTH0_CLIENT_SECRET,
  gmailUser: process.env.GMAIL_USER,
  gmailSecret: process.env.GMAIL_PASS,
  googleClient: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_AUTH_SECRET,
  slackClient: process.env.SLACK_CLIENT_ID,
  slackSecret: process.env.SLACK_AUTH_SECRET,
  cookieKeys: process.env.COOKIE_KEYS
};
