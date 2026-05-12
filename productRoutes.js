const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");

const router = express.Router();

router.get("/", verifyToken, getAllProducts);
router.get("/:id", verifyToken, getProductById);
router.post("/", verifyToken, createProduct);
router.patch("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

module.exports = router;
