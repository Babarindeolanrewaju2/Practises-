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
mongoose.connect('mongodb://localhost/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to database');
}).catch((err) => {
    console.log(err);
});

// Set up route to get all books
app.get('/books', (req, res) => {
    Book.find().then((books) => {
        res.status(200).send(books);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    });
});

// Set up route to add a book
app.post('/books', (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        available: req.body.available
    });

    book.save().then(() => {
        res.status(201).send(book);
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
});

// Set up route to remove a book
app.delete('/books/:id', (req, res) => {
    Book.findByIdAndDelete(req.params.id).then(() => {
        res.status(200).send('Book deleted');
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    });
});

// Set up route to get all records
app.get('/records', (req, res) => {
    Record.find().populate('book').then((records) => {
        res.status(200).send(records);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    });
});

// Set up route to add a record
app.post('/records', (req, res) => {
    const record = new Record({
        book: req.body.book,
        borrower: req.body.borrower,
        borrowedDate: req.body.borrowedDate,
        returnDate: req.body.returnDate
    });

    record.save().then(() => {
        Book.findByIdAndUpdate(req.body.book, {
            available: false
        }).then(() => {
            res.status(201).send(record);
        }).catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
});

// Set up route to update a record
app.put('/records/:id', (req, res) => {
    Record.findByIdAndUpdate(req.params.id, {
        returnDate: req.body.returnDate
    }).then(() => {
        Book.findByIdAndUpdate(req.body.book, {
            available: true
        }).then(() => {
            res.status(200).send('Record updated');
        }).catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
