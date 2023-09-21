const { Redis } = require('ioredis');

const redis = new Redis();

function planCacheMiddleware(cacheKey) {
  return async function (req, res, next) {
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      res.json(JSON.parse(cachedData));
    } else {
      next();
    }
  };
}

module.exports = {
  planCacheMiddleware
};
