'use strict'

import { checkUpdate } from '../utils/validator.js'
import Company from './company.model.js'
import Category from '../category/category.model.js'
import ExcelJS from 'exceljs'

export const add = async(req,res)=>{
    try{
        let data = req.body
        let companyExist = await Company.findOne({ name: data.name });
        if (companyExist) return res.status(400).send({ message: 'company with this name already exists' })
        let category = await Category.findOne({ _id: data.category })
        if(!category) return res.send({message: 'Category not found'})
        let company = new Company(data)
        await company.save()
        return res.send({message: 'Company saved successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'Error saving company'})
    }
}

export const update = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params
        let companyExist = await Company.findOne({ name: data.name });
        if (companyExist) return res.status(400).send({ message: 'company with this name already exists' })
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updated = await Company.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).populate('category')
        if (!updated) return res.status(401).send({ message: 'Company not found and not updated' })
        return res.send({ message: 'Updated Company', updated })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'error updating Company' })
    }
}

export const orderAZ = async (req, res) => {
    try {
        let companies = await Company.find().sort({name: 1})// Orden ascendente
        return res.send({ companies })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error ordering companies' })
    }
}

export const orderZA = async (req, res) => {
    try {
        let companies = await Company.find().sort({name: -1})// Orden descendente
        return res.send({ companies })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error ordering companiesD', err: err})
    }
}

export const orderYearsOfExperience = async (req, res) => {
    try {
        let companies = await Company.find().sort({yearsOfExperience: 1})// Orden descendente
        return res.send({ companies })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error ordering companies', err: err })
    }
}

export const excelReport = async (req, res) => {
    try {
        const companies = await Company.find().populate('category', ['name', 'description'])
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('companies')

        worksheet.addRow(['Name', 'Description' ,'Years Of Experience', 'Level Of Impact', 'Category'])
        companies.forEach(company => {
            worksheet.addRow([
                company.name,
                company.description,
                company.yearsOfExperience,
                company.levelOfImpact,
                company.category.name
            ])
        })

        let excel = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=GestorDeEmpresas.xlsx')

        res.send(excel)
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'error generating excel report' })
    }
}