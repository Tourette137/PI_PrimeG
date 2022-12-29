const jwt = require('jsonwebtoken');
const { promisify } = require('util');

async function isAuth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(401);
  }

  const [, token] = await authorization.split(" ");

  try {

    jwt.verify(token, 'PRIVATEKEY', (err, user) => {

      if (err) {
        return res.sendStatus(401)
      }
      else {
        req.userId = user.id

        return next()
      }
    }) 

  }
  catch (err) {
    console.log(err)
    return res.sendStatus(401);
  }
}

module.exports = isAuth;

