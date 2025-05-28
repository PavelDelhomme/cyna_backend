const express = require('express');
const router = express.Router();
const { ProductCategory, PromoCode } = require('../models');


exports.listProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignPromoToProductCategory = async (req, res) => {
  const { promoId, categoryId } = req.params;
  try {
    const promo    = await PromoCode.findByPk(promoId);
    const category = await ProductCategory.findByPk(categoryId);
    if (!promo || !category) {
      return res.status(404).json({ error: "Promo ou catégorie non trouvée." });
    }

    await category.update({ promo_code_id: promo.id });
    res.json({ message: "Code promo appliqué à la catégorie." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProductCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await ProductCategory.create({ name, description });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};