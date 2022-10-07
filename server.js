require('dotenv').config()
const express = require('express')
const app = express()

const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.set('view engine', 'ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({limit : '10mb', extended : false}))
app.use(express.static('public'))

const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
mongoose.connect(DATABASE_URL, CONFIG)

mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))


const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.listen(process.env.PORT || 5000)