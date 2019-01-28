/*
* Team yeti
* This is the passport module. it handles the login and register
* */
'use strict';
var LocalStrategy = require("passport-local").Strategy;

var bcrypt = require('bcrypt-nodejs');
var db = require('../app/database');
const connection = db.connect();

connection.query('USE emilt');

module.exports = (passport) => {
 passport.serializeUser((user, done)=>{
  done(null, user.id);
 });

 passport.deserializeUser((id, done)=>{
  db.deSerial(connection,id,done);
 });

 //signup passport. takes username and password and compares them to the users in users1 table
 passport.use(
  'local-signup',
  new LocalStrategy({
   usernameField : 'username',
   passwordField: 'password',
   passReqToCallback: true
  },
  (req, username, password, done)=>{
   connection.query("SELECT * FROM users1 WHERE username = ? ", 
   [username], (err, rows)=>{
    if(err)
     return done(err);
    if(rows.length){
     return done(null, false, req.flash('signupMessage', 'That is already taken'));
    }else{
      //password is bcrypted
     var newUserMysql = {
      username: username,
      password: bcrypt.hashSync(password, null, null),
      posts: 0,
      email: req.body.email,
      interest: req.body.category
     };

     var insertQuery = "INSERT INTO users1 (Username, password, posts, email, interest) values (?, ?, ?, ?, ?)";
     connection.query(insertQuery, [newUserMysql.username, newUserMysql.password, newUserMysql.posts, newUserMysql.email, newUserMysql.interest],
      (err, rows)=>{
        console.log(err);
        console.log(rows);
       newUserMysql.id = rows.insertId;

       return done(null, newUserMysql);
      });
    }
   });
  })
 );
//passport used in login
 passport.use(
  'local-login',
  new LocalStrategy({
   usernameField : 'username',
   passwordField: 'password',
   passReqToCallback: true
  },
 (req, username, password, done)=>{
  connection.query('SELECT * FROM users1 WHERE username = ?',[username],
  (err, rows)=>{
      if(err)
       return done(err);
      if(!rows.length){
       return done(null, false, req.flash('loginMessage', 'Check the username'));
      }
      if(!bcrypt.compareSync(password, rows[0].password))
       return done(null, false, req.flash('loginMessage', 'Wrong Password'));
  
      return done(null, rows[0]);
     });
  })
 );
};