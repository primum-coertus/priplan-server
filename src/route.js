const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.post('/create', controller.create);
router.delete('/deleteById/:_id', controller.deleteById);
router.put('/updateById/:_id', controller.updateById);
router.get('/getAll', controller.getAll);
router.get('/getByTitle/:title', controller.getByTitle);
router.get('/getById/:_id', controller.getById);
router.get('/', controller.getRoot);

module.exports = router;
