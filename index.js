/**
 * Created by Kenneth on 2017-04-10.
 */
const express = require("express");
const port = process.env.PORT || 10000;
const path = require("path");
const bodyParser = require("body-parser");

//require session
const session = require("express-session");

var pF = path.resolve(__dirname, "public");
var css = path.resolve(__dirname, "css");
var app = express();

//create a new server for socket, but combine it with express functions
const server = require("http").createServer(app);

//create a socket server with the new server
var io = require("socket.io")(server);

//postgres
const pg = require("pg");

//dburl
var dbURL = process.env.DATABASE_URL || "postgres://enterprisedb:kenster123@localhost:5444/chatapp";



app.use("/scripts", express.static("build"));
app.use("/styles", express.static(css));

app.use(bodyParser.urlencoded({
    extended: true
}));

//use sessions
app.use(session({
    secret:"cotton-candy",
    resave: true,
    saveUninitialized: true
}));

var Posts = [];
var Descriptions = [];

app.get("/", function(req, resp){

    if(req.session.user){
        resp.sendFile(pF+"/post.html");
    } else {
        resp.sendFile(pF+"/main.html");
    }
});


app.get("/reply/:replyindex", function(req, resp){
    var index = req.params.replyindex;

    req.session.replyindex = index;

    resp.sendFile(pF+"/reply.html");

});

app.get("/board", function(req, resp){

    resp.sendFile(pF+"/post.html");

});

app.get("/room/:roomindex", function(req, resp){
    console.log(req.params.roomindex);
    var index = req.params.roomindex;


    req.session.roomId = index;

    resp.sendFile(pF+"/room.html");
});


app.post("/register", function(req, resp){
    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
            resp.send({status:"fail"});
        }

        client.query("INSERT INTO user (username, email, password) VALUES ($1, $2, $3) RETURNING id", [req.body.un, req.body.em, req.body.pass], function(err, result){

            done();
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }

            resp.send({status:"success", id:result.rows[0].id});
        });
    })
});

app.post("/login", function(req, resp){
    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
            resp.send({status:"fail"});
        }

        client.query("SELECT id, username FROM user WHERE username = $1 AND password = $2", [req.body.un, req.body.pass], function(err, result){

            done();
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }

            if(result.rows.length > 0){
                req.session.user = result.rows[0];
                console.log(req.session.user);
                resp.send({status:"success", user:req.session.user});
            } else {
                resp.send({status:"fail"});
            }
        });
    })
});

app.post("/post", function(req, resp){

    var time;


    if(req.body.type == "create"){

        Posts.push(req.body.room);
        Descriptions.push(req.body.npost);


        pg.connect(dbURL, function(err, client, done){
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }


            client.query("insert into posts (title, description, user_id) values ($1, $2, (select id from user WHERE username = $3));", [req.body.room, req.body.npost, req.session.user['username']]);


            var query = client.query("select title, id, to_char(time_created, 'mm/dd/yyyy HH12:MI:SS') as time_created from posts where user_id = $1 and title = $2", [req.session.user['id'], req.body.room]);


            query.on('row', function(row){
                time = row;

                req.session.posts = row;
            });



            query.on('end',function () {
                done();
                console.log(req.session.posts);
                resp.send({
                    status:"success",
                    title:req.body.room,
                    index:Posts.length-1,
                    description:req.body.npost,
                    time: time,
                    username: req.session.user['username']

                });
            });

        });


    } else if(req.body.type == "read") {



        pg.connect(dbURL, function(err, client, done){
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }

            client.query(" select posts.id, title, description, username, to_char(time_created, 'mm/dd/yyyy HH12:MI:SS') as time_created from user inner join posts on (user.id = posts.user_id);", [], function(err, result){

                done();
                if(err){
                    console.log(err);
                    resp.send({status:"fail"});
                }

                if(result.rows.length > 0){
                    req.session.data = result.rows;
                    resp.send({status:"success", user:req.session.data});
                } else {
                    resp.send({status:"fail"});
                }
            });
        });



        // resp.send({
        //     status: "success",
        //     arr: Posts,
        //     darr: Descriptions,
        //     username: req.session.user['username']
        // });

    }

});

var replies = [];


app.post("/postreply", function(req, resp){

    var time;


    if(req.body.type == "pcreate"){

        replies.push(req.body.npost);


        pg.connect(dbURL, function(err, client, done){
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }




            client.query("insert into replies (reply, post_id) values ($1, (select id from posts WHERE title = $2));", [req.body.npost,  req.session.posts['title']]);


            var query = client.query("select id, to_char(time_created, 'mm/dd/yyyy HH12:MI:SS') as time_created from replies where post_id = $1 and reply = $2", [req.session.posts['id'], req.body.npost]);


            query.on('row', function(row){
                time = row;


            });



            query.on('end',function () {
                done();
                resp.send({
                    status:"success",
                    title:req.body.npost,
                    index:replies.length-1,
                    description:req.body.npost,
                    time: time,
                    username: req.session.user['username']

                });
            });

        });


    } else if(req.body.type == "pread") {



        pg.connect(dbURL, function(err, client, done){
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }

            client.query(" select replies.id, reply, to_char(replies.time_created, 'mm/dd/yyyy HH12:MI:SS') as time_created from posts inner join replies on (posts.id = replies.post_id);", [], function(err, result){

                done();
                if(err){
                    console.log(err);
                    resp.send({status:"fail"});
                }

                if(result.rows.length > 0){
                    req.session.data = result.rows;
                    resp.send({
                        status:"success",
                        user:req.session.data,
                        name:req.session.user['username']

                    });

                } else {
                    resp.send({status:"fail"});
                }
            });
        });



        // resp.send({
        //     status: "success",
        //     arr: Posts,
        //     darr: Descriptions,
        //     username: req.session.user['username']
        // });

    }

});



app.post("/room/roomId", function(req,resp){

    resp.send({
        index: req.session.roomId,
        data: req.session.data,
        user: req.session.user['username']
    });
});

// app.post("/updatevotes", function(req,resp){
//
//     pg.connect(dbURL, function(err, client, done){
//         if(err){
//             console.log(err);
//             resp.send({status:"fail"});
//         }
//
//         client.query("insert into replies (upvote_num, post_id) values ($1, (select id from posts WHERE title = $2));", [req.body.counter, req.body.title], function(err, result){
//             // UPDATE films SET kind = 'Dramatic' WHERE kind = 'Drama';
//             done();
//             if(err){
//                 console.log(err);
//                 resp.send({status:"fail"});
//             }
//
//         });
//     });
//
// });


app.post("/u/logout", function(req, resp){
    req.session.destroy();
    resp.end("success");
});


app.post("/removepost", function(req, resp){

    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
            resp.send({status:"fail"});
        }

        client.query("delete from posts using user where username = $1 and posts.id = $2", [req.session.user['username'], req.body.id], function(err, result){

            done();
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }

            resp.send("success");


        });
    });

});


io.on("connection", function(socket){

    socket.on("join room", function(roomId){
        socket.roomId = "room"+roomId;
        socket.join(socket.roomId);
    });

    socket.on("send message", function(obj){


        io.to(socket.roomId).emit("create message", obj);

    });

    socket.on("disconnect", function(){

    });
});


server.listen(port, function(err){
    if(err){
        console.log(err);
        return false;
    }

    console.log(port+" is running");
});