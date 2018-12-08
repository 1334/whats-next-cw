const userModule = require('../models/userModel');

const authorize = async (req,res,next) => {

  if(!req.headers.authorization) {
    res.status(400).send({
      errors: ['Invallid authorization header']
    })
    return;
  }

  const [strategy, token] = req.headers.authorization.split(' ');
  
  if (strategy === 'Bearer') {
    try {
      const user = await userModule.getUserByToken(token);
        req.user = user
    } catch (error) {
      //console.log(error)
      res.status(400).send({
        errors: ['Invalid token']
      })
      return;
    }
  }

  if(!req.user) {
    res.status(401).send({
      errors: ['Invalid token']
    })
    return;
  }

  await next();
  
};

module.exports = authorize;
