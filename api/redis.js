import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { command, key, value, ttl } = req.body;

  try {
    let result;
    switch (command) {
      case 'get':
        result = await redis.get(key);
        break;
      case 'set':
        result = await redis.set(key, value);
        if (ttl) await redis.expire(key, ttl);
        break;
      case 'del':
        result = await redis.del(key);
        break;
      case 'incr':
        result = await redis.incr(key);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported command' });
    }
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
