const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const { verifyUser } = require("../middlewares/authMiddleware");

console.log("verifyUser:", verifyUser);
console.log("wishlistController:", wishlistController);

router.get("/", verifyUser, wishlistController.getUserWishlist);
router.post("/", verifyUser, wishlistController.addToWishlist);
router.delete("/", verifyUser, wishlistController.removeFromWishlist);

module.exports = router;
