const express = require("express");
const {
  showBook,
  findBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/BooksController");
const { createValidation } = require("../validations/BooksValidation");
const router = express.Router();
const verifyToken = require("./../midlewares/verifyToken");

router.get("/book/:id", verifyToken, showBook);
router.get("/books", verifyToken, findBooks);
router.post("/book", verifyToken, createValidation, createBook);
router.patch("/book/:id", verifyToken, createValidation, updateBook);
router.delete("/book/:id", verifyToken, deleteBook);

module.exports = router;
