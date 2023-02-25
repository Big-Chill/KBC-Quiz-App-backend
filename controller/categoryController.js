const path = require('path');
const categoryModel = require(path.join(__dirname, '..', 'model', 'category'));

// /api/category/all

const getAllCategories = async (req, res) => {
  let categories;
  try {
    categories = await categoryModel.find();
  } catch (err) {
    return res.status(500).json({ message: 'Fetching categories failed, please try again later.' });
  }

  return res.status(200).json({
    categories:
      categories.map(category => category.toObject({ getters: true }))
  });
};

// /api/category/add
const addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  const createdCategory = new categoryModel({ name: name });

  try {
    await createdCategory.save();
  } catch (err) {
    return res.status(500).json({ message: 'Adding category failed, please try again later.' });
  }

  return res.status(201).json({ message: 'Category added successfully.', category: createdCategory.toObject({ getters: true }) });
}

module.exports = { getAllCategories, addCategory };