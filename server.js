// console.log('May Node be with you')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://worleydev:5vWAQ3YhghixAAuB@cluster0.4vxkn2o.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(connectionString, { useUnifiedTopology: 
true })
.then(client => {
    console.log('Connected to Database')
    const db = client.db('artist-quotes')
    const quotesCollection = db.collection('quotes')
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true}))
    app.use(bodyParser.json())
    app.use(express.static('public'))
    app.get('/', (req, res) => {
        quotesCollection.find().toArray()
            .then(results => {
                res.render('index.ejs', { quotes: results})
            })
            .catch(error => console.error(error))
    })
    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
            .then(result => {
                // console.log(result)
                res.redirect('/')
            })
            .catch(error => console.error(error))
    })
    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
            {name: 'Yoda'},
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                upsert: true
            }
        )
        .then(result => {
            console.log(result)
            res.json('Success')
        })
        .catch(error => {
            console.error(error)
        })
    })
    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
            {name: 'Darth Vader'}
        )
        .then(result => {
            res.json("Deleted Darth Vader")
        })
        .catch(error => console.error(error))
    })

    app.listen(3000, function() {
        console.log('listening on 3000')
    })
})
.catch(error => console.error(error))


// app.use(bodyParser.urlencoded({ extended: true}))

// 5vWAQ3YhghixAAuB