const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.post('/create', controller.create);
router.delete('/deleteById/:_id', controller.deleteById);
router.put('/updateById/:_id', controller.updateById);
router.put('/toggleIsCompletedById/:_id', controller.toggleIsCompletedById);
router.get('/getAll', controller.getAll);
router.get('/getToday', controller.getToday);
router.get('/getUpcoming', controller.getUpcoming);
router.get('/getByTitle/:title', controller.getByTitle);
router.get('/getById/:_id', controller.getById);
router.get('/', controller.getRoot);

module.exports = router;
