const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectID(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOperation;
        if (this._id) {
            dbOperation = db
                .collection('products')
                .updateOne({ _id: this._id }, { $set: this });
        } else {
            dbOperation = db
                .collection('products')
                .insertOne(this);
        }

        return dbOperation
            .then(result => {
                //console.log(result);
            })
            .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => console.log)
    }

    static findById(prodId) {
        const db = getDb();
        return db
            .collection('products')
            .find({ _id: new mongodb.ObjectID(prodId) })
            .next()
            .then(product => {
                return product;
            }).catch(err => console.log(err));
    }

    static deleteById(prodId) {
        const db = getDb();
        return db
            .collection('products')
            .deleteOne({ _id: new mongodb.ObjectID(prodId) })
            .then()
            .catch(err => console.log(err));
    }
}

module.exports = Product;