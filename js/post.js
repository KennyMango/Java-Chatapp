/**
 * Created by Kenneth on 2017-04-17.
 */
$(document).ready(function(){



    document.getElementById("logout").addEventListener("click", function () {
        $.ajax({
            url:"/u/logout",
            type:"post",
            success:function(resp){
                if(resp == "success"){
                    location.href = "/";
                }
            }
        })

    });




    document.getElementById("post").addEventListener("click", function(){

        var title = document.getElementById("title");
        var description = document.getElementById("description");



        $.ajax({
            url:"/post",
            type:"post",
            data:{
                room: title.value,
                npost: description.value,
                type: "create"
            },
            success:function(resp){


                if(resp.status == "success"){
                    var row = document.getElementById("blog");
                    var ndiv = document.createElement("div");
                    var ntitle = document.createElement("h1");
                    var timestamp = document.createElement("em");
                    var ndescription = document.createElement("p");
                    var reply = document.createElement("a");
                    var chat = document.createElement("a");
                    var votecontainer = document.createElement("div");
                    var upvote = document.createElement("a");
                    var votes = document.createElement("span");
                    var downvote = document.createElement("a");
                    var remove = document.createElement("a");



                    upvote.className = "glyphicon glyphicon-chevron-up";
                    downvote.className = "glyphicon glyphicon-chevron-down";
                    votes.className = "label label-primary";
                    votecontainer.appendChild(downvote);
                    votes.innerHTML = "0";
                    votecontainer.appendChild(votes);
                    votecontainer.appendChild(upvote);


                    ndiv.className = "col-md-10 blogShort";
                    timestamp.innerHTML = "Created by "+resp.username+" on "+resp.time["time_created"];
                    ntitle.innerHTML = resp.title;
                    ndescription.innerHTML = resp.description;
                    chat.className =  "btn btn-blog pull-right marginBottom10";
                    chat.innerHTML = "CHAT";
                    remove.className=  "btn btn-blog pull-right marginBottom10";
                    remove.innerHTML = "REMOVE";
                    reply.className = "btn btn-blog pull-right marginBottom10";
                    reply.innerHTML = "REPLY";
                    ndiv.style.borderStyle = "solid";
                    ndiv.style.borderWidth = "medium";
                    ndiv.style.borderColor = "black";
                    ndiv.style.margin = "5px";
                    ndiv.id = ""+resp.time["id"];
                    ndiv.appendChild(ntitle);
                    ndiv.appendChild(timestamp);
                    ndiv.appendChild(ndescription);
                    ndiv.appendChild(votecontainer);
                    ndiv.appendChild(chat);
                    ndiv.appendChild(reply);
                    ndiv.appendChild(remove);

                    row.appendChild(ndiv);

                    chat.myindex = resp.index;
                    chat.addEventListener("click", function(){
                       location.href="/room/"+this.myindex;
                    });

                    remove.addEventListener("click", function(){
                        $.ajax({
                            url:"/removepost",
                            type:"post",
                            data:{
                                id: parseInt(ndiv.id)
                            },
                            success:function(resp){
                                if(resp == "success"){
                                    location.reload();
                                }
                            }
                        })
                    });

                    upvote.addEventListener("click", function () {
                        var newVote = votes.innerHTML;
                        var value = parseInt(newVote) + 1;
                        var updateVotes = ""+value;
                        votes.innerHTML = updateVotes;

                        $.ajax({
                            url:"/updatevotes",
                            type:"post",
                            data:{
                                counter: value,
                                title: title.value
                            },
                            success:function(resp){
                                console.log(resp);

                            }
                        })


                    });

                    downvote.addEventListener("click", function () {
                        var newVote = votes.innerHTML;
                        var value = parseInt(newVote) - 1;
                        var updateVotes = ""+value;
                        votes.innerHTML = updateVotes;
                    });


                // <div id="topic" class="upvote">
                //
                //         <a class="upvote"></a>
                //
                //         <span class="count">0</span>
                //
                //         <a class="downvote"></a>
                //
                //
                //
                //  </div>



                }

            }
        })
    });

    $.ajax({
        url:"/post",
        type:"post",
        data:{
            type: "read"
        },
        success:function(resp){
            console.log(resp);




            for(var i = 0; i<resp.user.length; i++) {

                if (resp.status == "success") {
                    var row = document.getElementById("blog");
                    var ndiv = document.createElement("div");
                    var ntitle = document.createElement("h1");
                    var timestamp = document.createElement("em");
                    var ndescription = document.createElement("p");
                    var reply = document.createElement("a");
                    var chat = document.createElement("a");
                    var votecontainer = document.createElement("div");
                    var upvote = document.createElement("a");
                    var votes = document.createElement("span");
                    var downvote = document.createElement("a");
                    var remove = document.createElement("a");


                    upvote.className = "glyphicon glyphicon-chevron-up upvote";
                    downvote.className = "glyphicon glyphicon-chevron-down downvote";
                    votes.className = "label label-primary counter";
                    votecontainer.appendChild(downvote);
                    votes.innerHTML = "0";
                    votecontainer.appendChild(votes);
                    votecontainer.appendChild(upvote);



                    ndiv.className = "col-md-10 blogShort";
                    ntitle.innerHTML = resp.user[i].title;
                    ndescription.innerHTML = resp.user[i].description;
                    timestamp.innerHTML = "Created by "+resp.user[i].username+" on "+resp.user[i].time_created;
                    chat.className =  "btn btn-blog pull-right marginBottom10";
                    chat.innerHTML = "CHAT";
                    reply.className = "btn btn-blog pull-right marginBottom10";
                    reply.innerHTML = "REPLY";
                    remove.className=  "btn btn-blog pull-right marginBottom10";
                    remove.innerHTML = "REMOVE";
                    ndiv.style.borderStyle = "solid";
                    ndiv.style.borderWidth = "medium";
                    ndiv.style.borderColor = "black";
                    ndiv.style.margin = "5px";
                    ndiv.id = ""+resp.user[i].id;
                    ndiv.appendChild(ntitle);
                    ndiv.appendChild(timestamp);
                    ndiv.appendChild(ndescription);
                    ndiv.appendChild(votecontainer);
                    ndiv.appendChild(chat);
                    ndiv.appendChild(reply);
                    ndiv.appendChild(remove);
                    row.appendChild(ndiv);

                    chat.myindex = i;
                    chat.addEventListener("click", function(){
                        location.href="/room/"+this.myindex;
                    });

                    remove.addEventListener("click", function(){
                        $.ajax({
                            url:"/removepost",
                            type:"post",
                            data:{
                                id: parseInt(ndiv.id)
                            },
                            success:function(resp){
                                if(resp == "success"){
                                    location.reload();
                                }
                            }
                        })
                    });

                    upvote.addEventListener("click", function () {
                        var value = parseInt(document.getElementsByClassName("counter").innerHTML) + 1;
                        document.getElementsByClassName("counter").innerHTML = ""+value;

                        $.ajax({
                            url:"/updatevotes",
                            type:"post",
                            data:{
                                counter: value,
                                title: title.value
                            },
                            success:function(resp){
                                console.log(resp);

                            }
                        })


                    });

                    downvote.addEventListener("click", function () {
                        var value = parseInt(document.getElementsByClassName("counter").innerHTML) - 1;
                        document.getElementsByClassName("counter").innerHTML = ""+value;
                    });


                }

            }

        }
    })




});