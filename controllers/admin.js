const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.getProducts = (req, res, next) => {
    Product
        .find()
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            console.log(products);
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Shop',
                path: '/admin/products'
            });
        }).catch(err => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });

    product
        .save()
        .then(result => {
            console.log('PRODUCT CREATED');
            res.redirect('/');
        }
        ).catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    const editMode = req.query.edit;
    if (!editMode) {
        console.log('editMode is false');
        res.redirect('/');
    }
    Product
        .findById(productId)
        .then(product => {
            if (!product) {
                console.log('Failed to get product');
                res.redirect('/');
            }

            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    Product
        .findById(id)
        .then(product => {
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageUrl = imageUrl;

            return product.save()
        })
        .then(result => {
            console.log('PRODUCT UPDATED');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product
        .findByIdAndRemove(productId)
        .then(() => {
            console.log('PRODUCT DESTROYED');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};