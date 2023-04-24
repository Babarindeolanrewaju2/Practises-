// Require necessary modules
const express = require('express');
const mongoose = require('mongoose');

// Set up Mongoose schema for book
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    }
});

// Set up Mongoose model for book
const Book = mongoose.model('Book', bookSchema);

// Set up Mongoose schema for record
const recordSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrower: {
        type: String,
        required: true
    },
    borrowedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    returnDate: {
        type: Date
    }
});

// Set up Mongoose model for record
const Record = mongoose.model('Record', recordSchema);

// Set up Express app
const app = express();

// Connect to MongoDB database
(async () => {
    try {
        await mongoose.connect('mongodb://localhost/library', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to database');
    } catch (err) {
        console.log(err);
    }
})();

// Set up route to get all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).send(books);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// Set up route to add a book
app.post('/books', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        available: req.body.available
    });

    try {
        await book.save();
        res.status(201).send(book);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

// Set up route to remove a book
app.delete('/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).send('Book deleted');
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// Set up route to get all records
app.get('/records', async (req, res) => {
    try {
        const records = await Record.find().populate('book');
        res.status(200).send(records);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// Set up route to add a record
app.post('/records', async (req, res) => {
    const record = new Record({
        book: req.body.book,
        borrower: req.body.borrower,
        borrowedDate: req.body.borrowedDate,
        returnDate: req.body.returnDate
    });

    try {
        await record.save();
        await Book.findByIdAndUpdate(req.body.book, {
            available: false
        });
        res.status(201).send(record);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// Set
// up route to update a record
app.put('/records/:id', async (req, res) => {
    try {
        await Record.findByIdAndUpdate(req.params.id, {
            returnDate: req.body.returnDate
        });
        await Book.findByIdAndUpdate(req.body.book, {
            available: true
        });
        res.status(200).send('Record updated');
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
