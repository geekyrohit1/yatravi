const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 50, // Increased for local Dev
  duration: 60 * 15, // per 15 minutes
});

const loginLimiter = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({ message: 'Too many login attempts. Try again later.' });
    });
};

const enquiryRateLimiter = new RateLimiterMemory({
  points: 5, // 5 enquiries
  duration: 60 * 60, // per 1 hour
});

const enquiryLimiter = (req, res, next) => {
  enquiryRateLimiter.consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).json({ message: 'Too many enquiries sent from this IP. Please try again later.' }));
};

const searchRateLimiter = new RateLimiterMemory({
  points: 30, // 30 rapid searches
  duration: 60, // per 1 minute
});

const searchLimiter = (req, res, next) => {
  searchRateLimiter.consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).json({ message: 'Too many searches. Please slow down.' }));
};

module.exports = {
  loginLimiter,
  enquiryLimiter,
  searchLimiter
};
