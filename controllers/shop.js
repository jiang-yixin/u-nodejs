const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product
        .fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        }).catch();
};

exports.getProducts = (req, res, next) => {
    Product
        .fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: '/products'
            });
        }).catch();
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product
        .findById(productId)
        .then(prod => {
            res.render('shop/product-detail', {
                product: prod,
                pageTitle: prod.title,
                path: '/products'
            });
        }
        ).catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: products
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product
        .findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            // console.log(result);
            res.redirect('/cart');
        });
};

exports.postDeleteCartProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .deleteItemFromCart(prodId)
        .then(data => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postCreateOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Cart',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};