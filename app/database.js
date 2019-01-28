/*
Team yeti
this module ables the acces to the database.
*/

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

//connection
const connect = () => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS
    });
    return connection;
};
//deSerial
const deSerial = ((connection,id,done,res) => {
        connection.query("SELECT * FROM users1 WHERE id = ? ", [id],
        (err, rows)=>{
            done(err, rows[0]);
           });
           
         });
//find if user exists
const findUser = (connection,username) => {
    connection.query('SELECT * FROM users1 WHERE username = ?',[username]
    )
};
//new user
const newUser = (connection, newUserMysql, insertQuery) =>{
    connection.query(insertQuery, [newUserMysql.username, newUserMysql.password]
        )};

//get user
const getUser = (connection,user_id, callback, res) => {
    connection.query('SELECT * FROM users1 WHERE id = ?;',[user_id],
    (err,results, fields) => {
        if(err) console.log(err);
        callback(results, res);
    }
    );
};
//insert information to the database
const insert = (data, connection, next,user)=>{
    connection.query('INSERT INTO uploaded(product, price,category, stars, owner,thumbnail, image, original) VALUES (?,?,?,?,?,?,?,?);',
    data,
    (err, results, fields)=> {
        if(err) console.log(err);
        const users = {username : user.username}
        addPoint(users, connection);
        next();
    },
    )};
  //Select From database
    const select = (connection, callback, res) => {
        connection.query('SELECT * FROM uploaded ORDER BY id DESC;',
            (err, results, fields) => {
                if(err) console.log(err);
                callback(results, res);
            }
        );
    };
    //Search from database, Searches by category
    const search = (data, connection, callback, res) => {
        connection.query('SELECT * FROM uploaded WHERE category = ? ORDER BY id DESC;', [data.cat],
            (err, results, fields) => {
                console.log(err);
                callback(results, res);
            }
        );
    };
//Search from database, Searches by rating
    const ratingSearch = (data, connection, callback, res) => {
        connection.query('SELECT * FROM uploaded WHERE stars = ? ORDER BY id DESC;', [data.star],
            (err, results, fields) => {
                console.log(err);
                callback(results, res);
            }
        );
    };
//get specific user posts from the user. Used in the profile screen
    const userPosts = (connection, callback, res, user) =>{
        console.log('users own posts');
        connection.query('SELECT * FROM uploaded WHERE owner = ?', [user.username],
        (err, results) =>{
            if(err) console.log(err)
            callback(results, res);
        }
        )
    };
    //Back-end is ready to update posts. we decided not to use this one in the finish program... maybe in the future
    const change = (data, connection) => {
        // simple query
        connection.query(
            'UPDATE uploaded SET product = ?, price = ? WHERE id = ?',[data.product, data.price, data.id],
            //'UPDATE images SET category = \''+data.cat+'\',title = \''+data.title+'\', details = \''+data.details+'\' WHERE id = \''+data.id +'\';',
            (err, results, fields) => {
                  if(err) console.log(err);    
            },
        );
      };
      //add like to the save_like table.
      const addLike = (data, connection) => {
          console.log(data.user, data.image_id);
        connection.query(
            'INSERT INTO save_like(Username,Review_id) VALUES (?,?);',[data.user,  data.image_id],
            (err, results, fields) => {
                if(err) console.log(err);
            }
        );
      };
    //add one point to the user. used when user likes picture.
      const addPoint =(user, connection) => {
        connection.query(
            'UPDATE users1 SET posts = posts + 1 WHERE username = ?', user.username,
            (err, results, fields) => {
                if(err)
                    console.log("error:"+ err);
            }
        );
      };
      //When ever user deletes post it will delete a point from the user. total posts can be seen in the profile screen.
      const losePoint =(user, connection) => {
        connection.query(
            'UPDATE users1 SET posts = posts - 1 WHERE username = ?', user,
            (err, results, fields) => {
                if(err)
                    console.log("error:"+ err);
            }
        );
      };
    //add likes to the posts that user likes.
      const addLikeToPost =(data, connection) => {
        console.log("addLikeToPost: "+ JSON.stringify(data));
        connection.query(
            'UPDATE uploaded SET likes = likes + 1 WHERE id = ?',data.image_id,
            (err, results, fields) => {
                if(err){
                    console.log("error", err);
                }else{
                    console.log("add like");
                    addLike(data, connection);
                }
            }
        );
      };
      //Select the user likes from the save_like table. used to specify what posts does the user like.
      const selectUserLikes = (connection, callback, res, user) => {
        connection.query(
            'SELECT * FROM save_like WHERE Username = ?',[user],
            (err, results, fields) => {
              if(err) console.log(err);
              callback(results, res);
            }
        );
    }
    //Used to delete posts from the uploaded table
    const deletePost = (connection, data)=> {
        losePoint(data.user, connection);
        connection.query(
            'DELETE FROM uploaded WHERE id = ?',[data.id],
            (err, results, fields) => {
              if(err) console.log(err);
                console.log("lose point from: " + data.user);
              
            }
        );
      };
//module exprts
module.exports = {
    connect: connect,
    deSerial: deSerial,
    findUser: findUser,
    newUser: newUser,
    getUser: getUser,
    insert: insert,
    select: select,
    search: search,
    ratingSearch: ratingSearch,
    userPosts: userPosts,
    change: change,
    addLike: addLike,
    addLikeToPost:addLikeToPost,
    selectUserLikes: selectUserLikes,
    addPoint: addPoint,
    deletePost: deletePost,
    losePoint:losePoint
};