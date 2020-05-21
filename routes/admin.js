const express = require('express');

const Router = express.Router();

const adminController = require('../controllers/admin');

Router.get('/add-product', adminController.getAddProduct);

Router.get('/products', adminController.getProducts);

Router.post('/add-product', adminController.postAddProduct);

Router.get('/edit-product/:productId', adminController.getEditProduct);

Router.post('/edit-product', adminController.postEditProduct);

Router.post('/delete-product', adminController.postDeleteProduct);

module.exports = Router;