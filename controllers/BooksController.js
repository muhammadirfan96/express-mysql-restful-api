const BooksModel = require("../models/BooksModel");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

exports.showBook = async (req, res) => {
  try {
    const response = await BooksModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: "data not found" });
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};

exports.findBooks = async (req, res) => {
  try {
    const title = req.query.title ?? "";
    const author = req.query.author ?? "";
    const publisher = req.query.publisher ?? "";
    const price = req.query.price ?? "";

    const where = {
      title: {
        [Op.like]: `%${title}%`,
      },
      author: {
        [Op.like]: `%${author}%`,
      },
      publisher: {
        [Op.like]: `%${publisher}%`,
      },
      price: {
        [Op.like]: `%${price}%`,
      },
    };

    const limit = parseInt(req.query.limit ?? 10);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * page - limit;

    const data = await BooksModel.findAndCountAll({
      where: where,
      limit: limit,
      offset: offset,
    });
    const response = {
      total: data.count,
      page: page,
      data: data.rows,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};

exports.createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(500).json({ message: errors.array() });

    await BooksModel.create({
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher,
      price: req.body.price,
    });
    return res.status(201).json({ message: "data created" });
  } catch (error) {
    console.error(error);
  }
};

exports.updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(500).json({ message: errors.array() });

    const response = await BooksModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: "data not found" });

    await BooksModel.update(
      {
        title: req.body.title,
        author: req.body.author,
        publisher: req.body.publisher,
        price: req.body.price,
      },
      {
        where: { id: req.params.id },
      }
    );
    return res.status(200).json({ message: "data updated" });
  } catch (error) {
    console.error(error);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const response = await BooksModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: " data not found" });
    await BooksModel.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: "data deleted" });
  } catch (error) {
    console.error(error);
  }
};
