const jwt = require('jsonwebtoken');
const { promisify } = require('util');

async function isAuth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(401);
  }

  const [, token] = await authorization.split(" ");
  try {
    var decoded =jwt.verify(token, 'PRIVATEKEY')
    req.userId = decoded.id
    next();
  }
   catch (err) {
    console.log(err)
    return res.sendStatus(401);
  }
}

module.exports = isAuth;

