const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const MONGODB_URI = 'mongodb://localhost:27017/dktpassport';

const app = express();

// require('./config/passport')(passport);
const userRoutes = require('./routes/user');
const errorController = require('./controller/error');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./config/passport')(passport);

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    next();
})

app.use(userRoutes);
app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error)
    res.redirect('/500');
});

mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
    app.listen(process.env.PORT || 3000)
}).catch(err => { console.log(err) })