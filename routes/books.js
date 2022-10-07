const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

router.get('/', (req , res) =>{
    res.render("books/index")
})

router.get('/new', async(req , res) =>{
   try{
    const authors = await Author.find({})
    res.render("books/new",{ 
        book : new Book(),
        authors : authors
    })
   } catch {
    res.redirect('/')
   }
})

router.post('/', async( req, res) =>{
    const book = new Author({
        title : req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)
    try{
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)
    } catch {
        res.render('books/new',{
            book : book,
            errorMessage : "Error creating book"
        })
    }
})

router.get('/:id', async( req , res) =>{
    try{
        const book = await Book.findById(req.params.id)
                                .populate('author')
                                .exec()
        res.render('books/show',{
            book : book
        })                        
    } catch {
        res.redirect('/')
    }
})

function saveCover(book, coverEncoded){
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      book.coverImage = new Buffer.from(cover.data, 'base64')
      book.coverImageType = cover.type
    }
}


module.exports = router