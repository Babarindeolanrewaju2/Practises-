// Import required packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Define MongoDB database URL and collection name
const mongoUrl = 'mongodb://localhost:27017/mydatabase';
const collectionName = 'products';

// Create a Product schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number
});

// Create a Product model based on the schema
const Product = mongoose.model('Product', productSchema);

// Create Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
  if (err) throw err;
  console.log('Connected to MongoDB database');
});

// Define routes
app.get('/products', function(req, res) {
  // Find all products and return as JSON
  Product.find(function(err, products) {
    if (err) throw err;
    res.json(products);
  });
});

app.get('/products/:id', function(req, res) {
  // Find product by ID and return as JSON
  const id = req.params.id;
  Product.findById(id, function(err, product) {
    if (err) throw err;
    res.json(product);
  });
});

app.post('/products', function(req, res) {
  // Insert new product and return as JSON
  const product = new Product(req.body);
  product.save(function(err, product) {
    if (err) throw err;
    res.json(product);
  });
});

app.put('/products/:id', function(req, res) {
  // Update product by ID and return as JSON
  const id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, { new: true }, function(err, product) {
    if (err) throw err;
    res.json(product);
  });
});

app.delete('/products/:id', function(req, res) {
  // Delete product by ID and return success message
  const id = req.params.id;
  Product.findByIdAndDelete(id, function(err, product) {
    if (err) throw err;
    res.json({ message: 'Product deleted' });
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});
