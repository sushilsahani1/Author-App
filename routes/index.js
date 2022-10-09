const express = require('express')
const Book = require('../models/book')
const router  = express.Router()

router.get('/', async(req , res) =>{
    let books
    try{
        books = await Book.find().sort({createdAt: 'desc'}).limit(6).exec()
        res.render("main-index",{books : books})
    } catch {
        books = []
    }
})

module.exports = router