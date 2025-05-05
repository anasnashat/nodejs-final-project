const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController")


router.get("/:userId",cartController.getCart)

router.post("/:userId/", cartController.addToCart)

router.put("/:userId/",cartController.updateCart)

router.delete("/:userId/", cartController.deleteCart)

module.exports = router