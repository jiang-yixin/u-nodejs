const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(username, email, id, cart) {
        this.name = username;
        this.email = email;
        this._id = id;
        this.cart = cart; // {items: []}
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            // update
            dbOp = db
                .collection('users')
                .updateOne({ _id: this._id }, { $set: this });
        } else {
            // new 
            dbOp = db
                .collection('users')
                .insertOne(this);
        }

        return dbOp
            .then()
            .catch(err => console.log(err));
    }

    addToCart(product) {
        const db = getDb();
        let quantity = 1;
        let updatedCart = { ...this.cart };
        const cartProductIndex = updatedCart.items.findIndex(p => {
            return product._id.toString() === p.productId.toString();
        })
        if (cartProductIndex >= 0) {
            // product is already in cart
            quantity = updatedCart.items[cartProductIndex].quantity;
            updatedCart.items[cartProductIndex].quantity = quantity + 1;
        } else {
            // add the product in cart
            updatedCart.items.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: quantity
            })
        }
        return db
            .collection('users')
            .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });
    }

    deleteItemFromCart(prodId) {
        const updateCartItems = this.cart.items.filter(i => {
            return i.productId.toString() !== prodId.toString();
        });
        const db = getDb();

        return db
            .collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: { items: updateCartItems } } }
            );
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });

        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p, quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString()
                        }).quantity
                    }
                })
            })
            .catch(err => console.log(err));
    }

    addOrder() {
        const db = getDb();
        return this
            .getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new mongodb.ObjectId(this._id),
                        name: this.name
                    }
                }
                return db.collection('orders').insertOne(order);
            })
            .then(result => {
                this.cart.items = [];
                return db
                    .collection('users')
                    .updateOne(
                        { _id: new mongodb.ObjectId(this._id) },
                        { $set: { cart: { items: [] } } }
                    );
            })
            .catch(err => console.log(err));
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders').find({ 'user._id': new mongodb.ObjectId(this._id) }).toArray();
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new mongodb.ObjectId(userId) });
    }
}

module.exports = User;