import express from 'express'
import { add, excelReport, orderAZ, orderYearsOfExperience, orderZA, update } from './company.controller.js'
import { validateJwt } from '../middleware/validate-jwt.js'

const api = express.Router()

//Rutas privadas
api.post('/add', [validateJwt], add)
api.put('/update/:id', [validateJwt], update)
api.get('/orderAZ', [validateJwt], orderAZ)
api.get('/orderZA', [validateJwt], orderZA)
api.get('/orderYearsOfExperience', [validateJwt], orderYearsOfExperience)
api.get('/excelReport', [validateJwt], excelReport)

export default api