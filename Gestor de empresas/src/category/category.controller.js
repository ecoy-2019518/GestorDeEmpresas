'use strict'

import Category from './category.model.js'

export const add = async (req, res) => {
    try {
        let data = req.body
        let categoryExist = await Category.findOne({ name: data.name });
        if (categoryExist) return res.status(400).send({ message: 'Category with this name already exists' })

        if (!data.name || !data.description) return res.status(400).send({ message: 'You must send all the parameters' })

        let category = new Category(data)
        await category.save()
        return res.send({ message: 'A new category was created' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error saving category', err: err })
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let categoryExist = await Category.findOne({ name: data.name });
        if (categoryExist) return res.status(400).send({ message: 'Category with this name already exists' })
        let updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true })
        if (!updatedCategory) {
            return res.status(404).send({ message: 'Category not found' })
        }
        return res.send({ message: 'Category updated successfully', updatedCategory })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating category' })
    }
};

export const deleteC = async (req, res) => {
    try {
        let { id } = req.params
        let deleteCategory = await Category.findOneAndDelete({ _id: id })
        if (!deleteCategory) return res.status(404).send({ message: 'Category not found and not deleted' })
        return res.send({ message: `Category with name ${deleteCategory.name} deleted successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting category' })
    }
}