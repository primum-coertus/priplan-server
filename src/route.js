const express = require('express');
const controller = require('./controller');
const { planCacheMiddleware } = require('./middleware');

const router = express.Router();

router.post('/create', controller.create);
router.delete('/deleteById/:_id', controller.deleteById);
  planCacheMiddleware('get_today'),
  router.put('/toggleIsCompletedById/:_id', controller.toggleIsCompletedById);
router.get(
  '/getToday',
  planCacheMiddleware('get_today'),
  controller.getToday
);
router.get(
  '/getUpcoming',
  planCacheMiddleware('get_upcoming'),
  controller.getUpcoming
);
router.get('/', controller.getRoot);

module.exports = router;
