const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {verifiyUser} = require("../middlewares/authMiddleware");


router.get('/', verifiyUser ,orderController.getOrder)
router.post('/', verifiyUser, orderController.createOrder);
router.put('/:orderId',verifiyUser, orderController.updateOrder);
router.delete('/:orderId',verifiyUser, orderController.deleteOrder);

module.exports = router;