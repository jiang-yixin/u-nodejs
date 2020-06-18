const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const errorsController = require('./controllers/errors');

const mongoConnect = require('./util/database').mongoConnect;

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
        .findById('5ed8097a42555bea11151d6c')
        .then(user => {
            req.user = new User(user.name, user.email, user._id, user.cart);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorsController.get404);

mongoConnect(client => {
    app.listen(3000);
});
