const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/products'
        });
    });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.getProductById(productId, product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCarts(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProduct = cart.products.find(p => p.id === product.id);
                if (cartProduct) {
                    cartProducts.push({ productData: product, qty: cartProduct.qty });
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: cartProducts
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.getProductById(prodId, prodcut => {
        Cart.saveProduct(prodId, prodcut.price);
        res.redirect('/cart');
    });
};

exports.postDeleteCartProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.getProductById(prodId, product => {
        Cart.deleteProduct(product.id, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Cart',
        path: '/orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};