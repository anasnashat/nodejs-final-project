const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const { verifiyUser } = require("../middlewares/authMiddleware");


router.get("/", verifiyUser, wishlistController.getUserWishlist);
router.post("/", verifiyUser, wishlistController.addToWishlist);
router.delete("/", verifiyUser, wishlistController.removeFromWishlist);

module.exports = router;
