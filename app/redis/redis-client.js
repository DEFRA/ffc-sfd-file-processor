const redis = require('redis')
const { promisify } = require('util')

let redisClient

const connectRedis = async () => {
  redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  })

  redisClient.on('error', (err) => {
    console.error('Redis client error:', err)
  })

  await redisClient.connect()
}

const setAsync = async (key, value) => {
  if (!redisClient) {
    await connectRedis()
  }
  console.log(`Setting key: ${key}, value: ${value}`)
  return redisClient.set(key, value)
}

const getAsync = async (key) => {
  if (!redisClient) {
    await connectRedis()
  }
  console.log(`Getting key: ${key}`)
  return redisClient.get(key)
}

const expireAsync = async (key, seconds) => {
  if (!redisClient) {
    await connectRedis()
  }
  console.log(`Setting expiration for key: ${key}, seconds: ${seconds}`)
  return redisClient.expire(key, seconds)
}

const keysAsync = async (pattern) => {
  if (!redisClient) {
    await connectRedis()
  }
  console.log(`Getting keys with pattern: ${pattern}`)
  return redisClient.keys(pattern)
}

const delAsync = async (key) => {
  if (!redisClient) {
    await connectRedis()
  }
  console.log(`Deleting key: ${key}`)
  return redisClient.del(key)
}

module.exports = { redisClient, setAsync, getAsync, expireAsync, connectRedis, keysAsync, delAsync }
