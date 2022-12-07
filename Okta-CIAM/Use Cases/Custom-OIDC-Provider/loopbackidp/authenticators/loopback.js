const axios = require("axios");

require('dotenv').config();

 // Perform authentication 
 // Okta - Get the ID Token
exports.validateLogin = async (username, password) => {
  try {
    let data = process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET ;
    let buff = Buffer.from(data);
    let encodedSecret = buff.toString("base64");

    const options = {
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
        authorization: "Basic " + encodedSecret,
      },
    };
    payload = {
      username: username,
      password: password,
      grant_type: "password",
      scope: "openid email profile",
    };

    let qs = new URLSearchParams(payload)

    result = await axios.post(
      process.env.BASE_URL + "/oauth2/v1/token",
      qs.toString(),
      options
    );
    
    return result.data.id_token;

  } catch (error) {
    throw error;
  }
};

// Return public key for token validation
/*const getKeys = () => {
    let keys =  {"keys":[{"kty":"RSA","alg":"RS256","kid":"NfCTgvPyj8Oug4UnnPbyYmItJbi1YEt-g4ws0IVJXkE","use":"sig","e":"AQAB","n":"g7FW9COTuovozwAwDAAVyJJMHCPEOPvpYKzs7OoXnJpxnuJsVuRTRDhRB45dyiAlK1aLFyJoc9DnomHW4VE9YQvK6OGiJTIe60u7pV6uVlxGBuf-8N6oHI4vwYeSGzOS4VJT3Ao0MUft1F-qpkURBLx0ZG3zTy6KWUWYWhW9Jcu9UBoQzIwAfx4fde5N0afb3z1TYmWLcngQYjTzrsCHnhQIrMsDaHvhOKRJCipmTvyfqzBkVP9ZJXAqn2TNMqTrFeYKN5T-RtitlzxtJVWkxTFsd8fZovJi1DSBERSubEMSLuA64MrTPemhUagTHHVqLvoSL-oQ9dofiYi4kbWzjQ"},{"kty":"RSA","alg":"RS256","kid":"LPNUk-err4_ZxbjOJOuRghpccrR_BFPItX-6Lsmjk_8","use":"sig","e":"AQAB","n":"xHZ37DZE3bU1H6yIFKJwnvb75UQlIEJJX4sXvt1_9wvkiVi1FzmQWeel4pn3QhAwrGz7F0Qj9DxGbrjXAMh6ddapwnDoK-e5ENbsxPvqFARcFmbU2aNvIUJ2AiYPhqdtH4ERjAy5sV7ZsSTuIAIjkKae7bk1ZQWRG37IsEBxM2-IDvpQL-TLTBiewIh0Gmot-y0ZZWxjVBiYo0EDJhdFuIfKe9yeCMOU-3MgryNJm5vyNrtkvhVnZkZhQZJ6PWe1bsAvK5V1fC0Bdwpe5MFoGN6sc8K7KcS7g8M2fC6eNLz_TBdmU3Qr3JOZc_ETMdaI93J2MIs1NsjcTBnI27g6pw"}]};
    return keys;
};*/

// Return public key for token validation
// Okta - Get public key from jwks endpoint
exports.getKeys = async () => {
  const options = {
    headers: {
      accept: "application/json",
      "content-type": "application/json"
    },
  };
  let result = await axios.get(process.env.BASE_URL + "/.well-known/openid-configuration", options);
  let keydata = await axios.get(result.data.jwks_uri, options);
  return keydata.data;
};

// Return ID token for Inbound IDP verification
// // Okta - Relay the token generated during authentication
exports.getToken =  (token) => {
    var responseData = {
        access_token: token,
        token_type: "Bearer",
        expires_in: 3600,
        scope: "openid",
        id_token: token,
      };
    return responseData;
  };