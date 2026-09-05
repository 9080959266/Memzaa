"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCategoryStatus = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const PhotoshootCategory_js_1 = require("../models/PhotoshootCategory.js");
const Package_js_1 = require("../models/Package.js");
const getCategories = async (req, res) => {
    try {
        const categories = await PhotoshootCategory_js_1.PhotoshootCategory.find().sort({ order: 1 });
        // Enrich with package count
        const enriched = await Promise.all(categories.map(async (cat) => {
            const count = await Package_js_1.Package.countDocuments({ categoryId: cat._id, isActive: true });
            return {
                ...cat.toObject(),
                packageCount: count
            };
        }));
        res.json({
            success: true,
            categories: enriched
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const { name, slug, description, image, icon, banner, featured, order } = req.body;
        const category = await PhotoshootCategory_js_1.PhotoshootCategory.create({
            name,
            slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description,
            image: image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
            icon: icon || 'camera',
            banner: banner || '',
            featured: featured ?? true,
            order: order || 0
        });
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await PhotoshootCategory_js_1.PhotoshootCategory.findByIdAndUpdate(id, req.body, { new: true });
        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found' });
            return;
        }
        res.json({
            success: true,
            message: 'Category updated successfully',
            category
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await PhotoshootCategory_js_1.PhotoshootCategory.findByIdAndDelete(id);
        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found' });
            return;
        }
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteCategory = deleteCategory;
const toggleCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await PhotoshootCategory_js_1.PhotoshootCategory.findById(id);
        if (!category) {
            res.status(404).json({ success: false, message: 'Category not found' });
            return;
        }
        category.isActive = !category.isActive;
        await category.save();
        res.json({
            success: true,
            message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
            category
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.toggleCategoryStatus = toggleCategoryStatus;
