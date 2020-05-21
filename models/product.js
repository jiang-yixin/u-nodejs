const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const dataFilePath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = (callback) => {
    fs.readFile(dataFilePath, (err, dataContent) => {
        if (err) {
            callback([]);
        } else {
            callback(JSON.parse(dataContent));
        }
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    };

    save() {
        getProductsFromFile((products) => {
            if (this.id) {
                const updatedProductIndex = products.findIndex(p => p.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[updatedProductIndex] = this;
                fs.writeFile(dataFilePath, JSON.stringify(updatedProducts), (err) => {
                    console.log('Product save error 1: ' + err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(dataFilePath, JSON.stringify(products), (err) => {
                    if (err) {
                        console.log('Product save error 2: ' + err);
                    }
                });
            }
        });
    };

    static fetchAll(callback) {
        getProductsFromFile(callback);
    };

    static getProductById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    };

    static deleteProductById(id) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            const updatedProducts = products.filter(p => p.id !== id);
            fs.writeFile(dataFilePath, JSON.stringify(updatedProducts), (err) => {
                if (err) {
                    console.log('deleteProductById :', err);
                } else {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    };
}