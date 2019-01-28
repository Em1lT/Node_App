/*
Team yeti
Routes of the project.
 */
var db = require('../app/database');

const multer = require('multer');
const resize = require('../app/resize');
const upload = multer({ dest: 'public/uploads/' });
const connection = db.connect();

const cb = (result, res) => {
  res.send(result);
};
//specifying which table to use
connection.query('USE emilt');
//everything is exported
module.exports = (app, passport) => {
  //main site

  app.get('/', (req, res) => {
    res.render('index.ejs');
  });

  //when login is pressed this will start and it renders login.ejs view.
  app.get('/login', (req, res) => {
    res.render('login', { message: req.flash('loginMessage') });
  });
  //login if succes or failure
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: 'Mainfeed',
    failureRedirect: 'login',
    failureFlash: true
  }),
    (req, res) => {
      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect('/node/');
    });
  //signup site where user are created. first renders the signup.ejs page
  app.get('/signup', (req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });
  //redirect depends if succes or failure
  app.post('/signup', 
  passport.authenticate('local-signup',
    {
    successRedirect: 'Mainfeed',
    failureRedirect: 'signup',
    failureFlash: true,
}));

  //if user isLoggedIN, will render the main feed page where reviews are created
  app.get('/Mainfeed', isLoggedIn, (req, res) => {
    console.log(req.user.id);
    res.render('Mainfeed.ejs', {
      user: req.user
    });
  });
  //when liking image this happens. Also add like to post
  app.use('/likeImage', (req, res) => {
    data = {
      user: req.user.username,
      image_id: req.query.id
    }
    db.addLikeToPost(data, connection);
    res.redirect('Mainfeed');
  });

//search posts
    app.post('/search', (req, res, next) =>{
        console.log('search post');
        next();
    });
//search by rating. rating is passed in the url
    app.use('/search:rating', (req, res, next) => {
        console.log('searching...');
        console.log(req.body.rating);
        var data = {
            star: req.body.rating,
        };
        db.ratingSearch(data, connection, next);
        //res.redirect('/');
    });

//post phone category
    app.post('/phone', (req, res, next) =>{
        console.log('phone post');
        next();
    });
//takes catch of the phone category. shows the results. IS same in the television, computer and tablet.
    app.use('/phone:category', (req, res, next) => {
        console.log('phone category...');
        console.log(req.body.category);
        var data = {
            cat: req.body.phone,
        };
        console.log(data);
        db.search(data, connection, next);
        //res.redirect('/');
    });

    app.post('/television', (req, res, next) =>{
        console.log('television post');
        next();
    });

    app.use('/television:category', (req, res, next) => {
        console.log('television category...');
        console.log(req.body.category);
        var data = {
            cat: req.body.television,
        };
        console.log(data);
        db.search(data, connection, next);
        //res.redirect('/');
    });
    app.post('/computer', (req, res, next) =>{
        console.log('computer post');
        next();
    });

    app.use('/computer:category', (req, res, next) => {
        console.log('computer category...');
        console.log(req.body.category);
        var data = {
            cat: req.body.computer,
        };
        console.log(data);
        db.search(data, connection, next);
        //res.redirect('/');
    });
    app.post('/tablet', (req, res, next) =>{
        console.log('tablet post');
        next();
    });

    app.use('/tablet:category', (req, res, next) => {
        console.log('tablet category...');
        console.log(req.body.category);
        var data = {
            cat: req.body.tablet,
        };
        console.log(data);
        db.search(data, connection, next);
        //res.redirect('/');
    });

  //upload--happens in the main feed
  app.post('/upload', upload.single('mediafile'), (req, res, next) => {
    next();
  });
  app.use('/upload', (req, res, next) => {
    resize.doResize(req.file.path, 300,
      './public/thumbs/' + req.file.filename + '_thumb', next);
  });
  app.use('/upload', (req, res, next) => {
    resize.doResize(req.file.path, 640,
      './public/medium/' + req.file.filename + '_medium', next);
  });
  // insert to database
  app.use('/upload', (req, res, next) => {
    const data = [
        req.body.product.toUpperCase(),
        req.body.price + '€',
        req.body.category,
        req.body.star,
        req.user.username,
        req.file.filename + '_thumb',
        req.file.filename + '_medium',
        req.file.filename + '.jpg',
    ];
    const user = {username:  req.user.username}
    db.insert(data, connection, next, user);
  });
  app.use('/upload', (req, res) => {
    db.select(connection, cb, res);
  });

    app.use('/search', (req, res) =>{
        db.select(connection, cb, res);
    });

    app.use('/phone', (req, res) =>{
        db.select(connection, cb, res);
    });

    app.use('/television', (req, res) =>{
        db.select(connection, cb, res);
    });

    app.use('/computer', (req, res) =>{
        db.select(connection, cb, res);
    });

    app.use('/tablet', (req, res) =>{
        db.select(connection, cb, res);
    });

    //get images
  app.get('/images', (req, res) => {
    db.select(connection, cb, res);
  });

  //profile page
  app.get('/profile',isLoggedIn, (req, res) => {
    res.render('profile');
  });
//delete picture
  app.use('/delete', (req, res) => {
    data = {id: req.query.id, user: req.user.username}
    console.log(data);
    db.deletePost(connection, data);
    res.redirect('profile');
  });

  //update. not used in finsihed product
  app.use('/update', (req, res) => {
    console.log("update");
    console.log(req.query);
    var data = {
      product: req.query.product,
      price: req.query.price,
      id: req.query.id
    }
    db.change(data, connection);
    res.redirect('profile')
  });

  //get the user posts
  app.get('/userPosts', (req, res) => {
    db.userPosts(connection, cb, res, req.user);
  });

  //get user likes
  app.get('/user_likes', (req, res) => {
    db.selectUserLikes(connection, cb, res, req.user.username);
  });
  //get the right profile
  app.get('/users', (req, res) => {
    db.getUser(connection, req.user.id, cb, res);
  });
  //logout whenever /logout is pressed
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/node/');
  })
};
//function to determinate if user is logged in or out.
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/node/');
}