const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'carts.json'
);

module.exports = class Cart {
    static saveProduct(id, price) {
        fs.readFile(dataFilePath, (err, dataContent) => {
            let carts = { products: [], totalPrice: 0 };
            if (!err) {
                carts = JSON.parse(dataContent);
            }
            const productIndex = carts.products.findIndex(p => p.id === id);
            const existingProduct = carts.products[productIndex];
            let updatedProduct;
            if (existingProduct) {
                // product exist, increment qty
                // Immutable pattern
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                carts.products = [...carts.products];
                carts.products[productIndex] = updatedProduct;
                //existingProduct.qty = existingProduct.qty + 1;
            } else {
                // add a new product in cart
                updatedProduct = { id: id, qty: 1 };
                carts.products = [...carts.products, updatedProduct];
                //carts.products.push(updatedProduct);
            }
            carts.totalPrice = carts.totalPrice + +price;
            fs.writeFile(dataFilePath, JSON.stringify(carts), err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, price) {
        fs.readFile(dataFilePath, (err, dataContent) => {
            if (err) {
                console.log('deleteProduct: ', err);
            } else {
                const updateCarts = { ...JSON.parse(dataContent) };
                const productInCart = updateCarts.products.find(p => p.id === id);
                if (!productInCart) {
                    return;
                }
                updateCarts.products = updateCarts.products.filter(p => p.id !== id);
                updateCarts.totalPrice = updateCarts.totalPrice - productInCart.qty * price;
                fs.writeFile(dataFilePath, JSON.stringify(updateCarts), err => {
                    console.log(err);
                });
            }
        });
    }

    static getCarts(cb) {
        fs.readFile(dataFilePath, (err, dataContent) => {
            if (err) {
                cb(null);
            } else {
                cb(JSON.parse(dataContent));
            }
        });
    }
}