const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  url: 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis Client Error', err));

client.connect();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = {
  client,
  getAsync,
  setAsync
};
