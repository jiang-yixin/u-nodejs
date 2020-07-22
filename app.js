const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose');

const errorsController = require('./controllers/errors');

const User = require('./models/user');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User
        .findById('5ef65ad283777854aec67794')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorsController.get404);

mongoose
    //.connect('mongodb+srv://yjiang:MyzeHSB18xcocZuz@cluster0-3fkqz.mongodb.net/shop?retryWrites=true&w=majority')
    .connect('mongodb+srv://yjiang:jTcpK3hgcJ2Tmx6t@cluster0-3fkqz.mongodb.net/shop')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Simon',
                    email: 'simon@simon.com',
                    items: []
                })
                user.save();
            }
        })
        console.log('Connected to mongodb!');
        app.listen(3000);
    }).catch(err => console.log(err));
