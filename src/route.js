const express = require('express');
const swaggerUi = require('swagger-ui-express');
const controller = require('./controller');
const { planCacheMiddleware } = require('./middleware');
const swaggerDocument = require('../swagger.json');

const router = express.Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.post('/create', controller.create);
router.delete('/deleteById/:_id', controller.deleteById);
router.put('/toggleIsCompletedById/:_id', controller.toggleIsCompletedById);
router.get('/getToday', planCacheMiddleware('get_today'), controller.getToday);
router.get(
  '/getUpcoming',
  planCacheMiddleware('get_upcoming'),
  controller.getUpcoming
);
router.get('/', controller.getRoot);

module.exports = router;
