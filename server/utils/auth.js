const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "mysecretsshhhhh"; // Use a more secure secret
const expiration = "2h";

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }
    if (!token) {
      return req;
    }
    try {
      const { data } = jwt.verify(token, jwtSecret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.error("Invalid token:", err.message);
    }
    return req;
  },
  signToken: function ({ firstName, email, _id }) {
    const payload = { firstName, email, _id };
    return jwt.sign({ data: payload }, jwtSecret, { expiresIn: expiration });
  },
};
