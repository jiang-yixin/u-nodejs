const MongoClient = require('mongodb').MongoClient;

let _db;

const mongoConnect = (cb) => {
    MongoClient
        .connect('mongodb+srv://yjiang:MyzeHSB18xcocZuz@cluster0-3fkqz.mongodb.net/test?retryWrites=true&w=majority')
        .then(result => {
            console.log('Connected to mongodb!');
            _db = result.db('shop');
            cb(result);
        })
        .catch(err => console.log(err));
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'Database not found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
