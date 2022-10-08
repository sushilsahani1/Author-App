const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

router.get('/', (req , res) =>{
    res.render("books/index")
})

router.get('/new', async(req , res) =>{
   try{
    const authors = await Author.find({})
    res.render("books/new",{ 
        authors : authors,
        book : new Book(),
    })
   } catch {
    res.redirect('/')
   }
})

router.post('/', async( req, res) =>{
    const book = new Book({
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

router.get('/:id/edit', async(req , res) =>{
    try{
        const book = await Book.findById(req.params.id)
        const authors = await Author.find({})
        res.render("books/edit",{ 
            authors : authors,
            book : book,
     })
    } catch {
     res.redirect('/')
    }
 })
 
 router.put('/:id', async( req, res) =>{
     let book
     try{
        book.title = req.body.title
        book.author = req.body.author
        book. publishDate = new Date(req.body.publishDate)
        book.pageCount= req.body.pageCount
        book.description= req.body.description
         if (req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover)
          }
         await book.save()
         res.redirect(`/books/${book.id}`)
     } catch {
        if(book == null){
            res.redirect('/')
        }
         res.render('books/edit',{
             book : book,
             errorMessage : "Error updating book"
         })
     }
 })

 router.delete('/:id', async (req, res) => {
    let book
    try {
      book = await Book.findById(req.params.id)
      await book.remove()
      res.redirect('/books')
    } catch {
      if (book == null) {
        res.redirect('/')
      } else {
        res.redirect(`/books/${book.id}`)
      }
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