const express = require("express");
const router = express.Router();
const ServiceCategory = require("../models/serviceCategory");

// -------------------------
// ✅ Get all categories
// -------------------------
router.get("/", async (req, res) => {
    try {
        const categories = await ServiceCategory.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

// -------------------------
// ✅ Create a new category
// -------------------------
router.post("/", async (req, res) => {
    try {
        const { name, options } = req.body;
        const newCategory = new ServiceCategory({ name, options: options || [] });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Failed to create category" });
    }
});

// -------------------------
// ✅ Update category name
// -------------------------
router.put("/:id", async (req, res) => {
    try {
        const updatedCategory = await ServiceCategory.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        );
        if (!updatedCategory) return res.status(404).json({ error: "Category not found" });
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ error: "Failed to update category" });
    }
});

// -------------------------
// ✅ Delete a category
// -------------------------
router.delete("/:id", async (req, res) => {
    try {
        const deletedCategory = await ServiceCategory.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ error: "Category not found" });
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Failed to delete category" });
    }
});

// -------------------------
// ✅ Add new service option to category
// -------------------------
router.post("/:id/options", async (req, res) => {
    try {
        const category = await ServiceCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });

        category.options.push(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: "Failed to add service option" });
    }
});

// -------------------------
// ✅ Update a service option
// -------------------------
router.put("/:categoryId/options/:optionId", async (req, res) => {
    try {
        const category = await ServiceCategory.findById(req.params.categoryId);
        if (!category) return res.status(404).json({ error: "Category not found" });

        const option = category.options.id(req.params.optionId);
        if (!option) return res.status(404).json({ error: "Service option not found" });

        option.name = req.body.name ?? option.name;
        option.price = req.body.price ?? option.price;
        option.perPerson = req.body.perPerson ?? option.perPerson;
        option.margin = req.body.margin ?? option.margin;

        await category.save();
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: "Failed to update service option" });
    }
});

// -------------------------
// ✅ Delete a service option
// -------------------------
router.delete("/:categoryId/options/:optionId", async (req, res) => {
    try {
        const category = await ServiceCategory.findById(req.params.categoryId);
        if (!category) return res.status(404).json({ error: "Category not found" });

        const option = category.options.id(req.params.optionId);
        if (!option) return res.status(404).json({ error: "Service option not found" });

        option.remove();
        await category.save();

        res.json({ message: "Service option removed successfully" });
    } catch (err) {
        res.status(400).json({ error: "Failed to delete service option" });
    }
});

module.exports = router;
