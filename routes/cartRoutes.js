const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController")
const {verifiyUser} = require("../middlewares/authMiddleware");


router.get("/",verifiyUser,cartController.getCart)

router.post("/", verifiyUser, cartController.addToCart)

router.put("/",verifiyUser, cartController.updateCart)

router.delete("/", verifiyUser,  cartController.deleteCart)

module.exports = router