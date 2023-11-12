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

router.get("/book/:id", showBook);
router.get("/books", findBooks);
router.post("/book", createValidation, createBook);
router.patch("/book/:id", createValidation, updateBook);
router.delete("/book/:id", deleteBook);

module.exports = router;
