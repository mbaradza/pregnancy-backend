var express = require('express');
 
var controller = require('./user.controller');
var router = express.Router();
router.get('/getAll',controller.getAll);
router.get('/getOne/:id', controller.getOne);
router.put('/update/:id', controller.update);
router.delete('/delete/:id',controller.delete);

module.exports = router;
