const express = require('express');
const router = express.Router();
const path = require("path");
var fs = require('fs');
const multer = require('multer');

let Article = require('../models/article');
let User = require('../models/user');

let pathimgjoin = path.join(__dirname, '../public/uploads/');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // app.use(express.static(path.join(__dirname, "public")));
        // cb(null, 'uploads/');
        // cb(null, '/public/uploads/');
        cb(null, pathimgjoin);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// Request - Add Article 
router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('add_article', {
        title: 'Add article'
    });
});

// Add Article
router.post('/add', upload.single('articleImage'), function (req, res) {
    console.log(req.body);
    console.log(req.file);
    req.checkBody('title', 'Тақырып атауын енгізіңіз').notEmpty();
    req.checkBody('body', 'Енгізіңіз').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            title: 'Жаңа тақырып қосу',
            errors: errors
        });
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;
        article.articleImage = req.file.path;

        article.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Тақырып қосылды');
                res.redirect('/users/adminpage');
            }
        });
    }
});

// Request - Updated Article
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (article.author != req.user._id) {
            req.flash('danger', 'Жалғастыру үшін жүйеге кіріңіз');
            res.redirect('/users/admin_page');
        } else {
            res.render('edit_article', {
                title: 'Тақырыпты өзгерту',
                article: article
            });
        }
    });
});

// Updated Article
router.post('/edit/:id', function (req, res) {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {
        _id: req.params.id
    };

    Article.update(query, article, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Тақырып жаңартылды');
            res.redirect('/');
        }
    });
});

// Delete Article
router.delete('/:id', function (req, res) {
    if (!req.user._id) {
        res.status(500).send();
    }

    let query = {
        _id: req.params.id
    };

    Article.findById(req.params.id, function (err, article) {
        if (article.author != req.user._id) {
            res.status(500).send();
        } else {
            Article.remove(query, function (err) {
                if (err) {
                    console.log(err);
                }
                res.send('Тақырып жойылды');
            });
        }
    });
});

// Get Single Article
router.get('/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        const img = Article.findById(req.params.id)
            .select('name _id articleImage');

        console.log(article.articleImage);
        const str1 = article.articleImage.replace(/C:\\Users\\Admin\\Desktop\\mernode\\public/, '');
        console.log(str1);
        const str2 = str1.replace(/\\/g, '/');
        console.log(str2);
        // mystring.replace(/\./g,' ')
        // str.replace(/C:\\Users\\Admin\\/, '');

        User.findById(article.author, function (err, user) {
            res.render('article', {
                title: article.title,
                article: article,
                author: user.username,
                articleImg: img,
                immp: str2
            });
        });
    });
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Жалғастыру үшін жүйеге кіріңіз');
        res.redirect('/users/login');
    }
}

module.exports = router;
ensureAuthenticated.exports;