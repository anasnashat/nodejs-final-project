const express = require("express");
const { getAllUsers, createUser, deleteUser, updateUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.put("/:id",updateUser)
module.exports = router;
