const express = require('express');
const router = express.Router();
const { ProductCategory, PromoCode, Product, ProductCategoryRole } = require('../models');


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

exports.updateProductCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await ProductCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Catégorie non trouvée." });
    }
    category.name = name;
    category.description = description;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ... existing imports and functions ...

exports.deleteProductCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Catégorie non trouvée." });
    }
    
    const { Product, ProductCategoryRole } = require('../models');
    
    // Vérifier s'il y a des produits qui utilisent cette catégorie
    const productsUsingCategory = await Product.findAll({
      where: { category_id: req.params.id },
      attributes: ['id', 'name']
    });
    
    if (productsUsingCategory.length > 0) {
      return res.status(400).json({ 
        error: `Impossible de supprimer cette catégorie.`,
        message: `${productsUsingCategory.length} produit(s) utilise(nt) encore cette catégorie.`,
        suggestion: "Vous devez d'abord déplacer ces produits vers une autre catégorie ou les supprimer.",
        products: productsUsingCategory.map(p => ({ id: p.id, name: p.name }))
      });
    }
    
    // Supprimer les associations catégories-rôles
    await ProductCategoryRole.destroy({
      where: { category_id: req.params.id }
    });
    
    await category.destroy();
    res.json({ message: "Catégorie supprimée avec succès." });
  } catch (err) {
    console.error('Erreur suppression catégorie :', err);
    res.status(500).json({ error: err.message });
  }
};

exports.checkProductCategoryDependencies = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // Vérifier les produits qui utilisent cette catégorie
    const products = await Product.findAll({
      where: { category_id: categoryId },
      attributes: ['id', 'name']
    });
    
    // Vérifier les associations catégorie-rôles
    const roleAssociations = await ProductCategoryRole.findAll({
      where: { category_id: categoryId }
    });
    
    const dependencies = {
      products: products.map(p => ({ id: p.id, name: p.name })),
      roleAssociations: roleAssociations.length,
      canDelete: products.length === 0, // ← Suppression possible seulement si aucun produit
      warnings: []
    };
    
    if (products.length > 0) {
      dependencies.warnings.push(
        `❌ SUPPRESSION IMPOSSIBLE : ${products.length} produit(s) utilise(nt) cette catégorie.`
      );
      dependencies.warnings.push(
        `💡 Vous devez d'abord déplacer ces produits vers une autre catégorie ou les supprimer.`
      );
    }
    
    if (roleAssociations.length > 0) {
      dependencies.warnings.push(
        `${roleAssociations.length} association(s) catégorie-rôle sera(ont) supprimée(s).`
      );
    }
    
    if (products.length === 0 && roleAssociations.length === 0) {
      dependencies.warnings.push(
        `✅ Aucune dépendance détectée. Suppression possible.`
      );
    }
    
    res.json(dependencies);
  } catch (err) {
    console.error('Erreur vérification dépendances catégorie :', err);
    res.status(500).json({ error: err.message });
  }
};