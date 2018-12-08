const fetch = require('node-fetch');
const thirdPartyAuth = {};
var dotenv = require('dotenv');
dotenv.load();

thirdPartyAuth.verifyFacebook = async clientToken => {
  const accessToken = process.env.APP_FB_ACCESS_TOKEN;
  const uri = `https://graph.facebook.com/debug_token?input_token=${clientToken}&access_token=${accessToken}`;
  let verification = await fetch(uri, {
    method: 'GET'
  });
  verification = await verification.json();

  return {
    isValid: verification.data.is_valid,
    userId: verification.data.user_id
  };
};

module.exports = thirdPartyAuth;
