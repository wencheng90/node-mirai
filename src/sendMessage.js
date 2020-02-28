const axios = require('axios');
const fs = require('fs');
const request = require('request');

const { Image } = require('./MessageComponent');

const sendFriendMessage = async ({
  messageChain,
  target,
  sessionKey,
  port = 8080,
}) => {
  const { data } = await axios.post(`http://localhost:${port}/sendFriendMessage`, {
    messageChain, target, sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendFriendMessage:', e.message);
    // process.exit(1);
  });
  return data;
};
const sendQuotedFriendMessage = async ({
  messageChain,
  target,
  quote,
  sessionKey,
  port = 8080,
}) => {
  const { data } = await axios.post(`http://localhost:${port}/sendFriendMessage`, {
    messageChain, target, sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedFriendMessage:', e.message);
    // process.exit(1);
  });
  return data;
};

const sendGroupMessage = async ({
  messageChain,
  target,
  sessionKey,
  port = 8080,
}) => {
  const { data } = await axios.post(`http://localhost:${port}/sendGroupMessage`, {
    messageChain, target, sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendGroupMessage:', e.message);
    // process.exit(1);
  });
  return data;
};
const sendQuotedGroupMessage = async ({
  messageChain,
  target,
  quote,
  sessionKey,
  port = 8080,
}) => {
  const { data } = await axios.post(`http://localhost:${port}/sendGroupMessage`, {
    messageChain, target, sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedGroupMessage:', e.message);
    // process.exit(1);
  });
  return data;
};

const uploadImage = async ({
  url,
  type,
  sessionKey,
  port,
}) => new Promise((resolve, reject) => {
  console.log(url);
  const options = {
    method: 'POST',
    url: `http://localhost:${port}/uploadImage`,
    'headers': {
      'Content-Type': 'multipart/form-data'
    },
    formData: {
      sessionKey,
      type,
      img: fs.createReadStream(url),
    }
  };
  request(options, (err, res, body) => {
    if (err) return reject('ERROR:', err);
    else return resolve(body);
  });
})

const sendImageMessage = async ({
  url,
  qq,
  group,
  sessionKey,
  port = 8080,
}) => {
  let type, send, target;
  if (qq) {
    type = 'friend';
    send = sendFriendMessage;
    target = qq;
  } else if (group) {
    type = 'group';
    send = sendGroupMessage;
    target = group;
  } else return console.error('Error @ sendImageMessage: you should provide qq or group');
  const imageId = await uploadImage({
    url,
    type,
    sessionKey,
    port,
  });
  const messageChain = [Image(imageId)];
  send({
    messageChain,
    target,
    sessionKey,
    port,
  });
};

module.exports = {
  sendFriendMessage,
  sendQuotedFriendMessage,
  sendGroupMessage,
  sendQuotedGroupMessage,
  uploadImage,
  sendImageMessage,
};