/**
 * Created by Kenneth on 2017-04-19.
 */
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


        var description = document.getElementById("reply");



        $.ajax({
            url:"/postreply",
            type:"post",
            data:{
                npost: description.value,
                type: "pcreate"
            },
            success:function(resp){


                if(resp.status == "success"){
                    var row = document.getElementById("blog");
                    var ndiv = document.createElement("div");
                    var timestamp = document.createElement("em");
                    var ndescription = document.createElement("p");
                    var votecontainer = document.createElement("div");
                    var upvote = document.createElement("a");
                    var votes = document.createElement("span");
                    var downvote = document.createElement("a");




                    upvote.className = "glyphicon glyphicon-chevron-up";
                    downvote.className = "glyphicon glyphicon-chevron-down";
                    votes.className = "label label-primary";
                    votecontainer.appendChild(downvote);
                    votes.innerHTML = "0";
                    votecontainer.appendChild(votes);
                    votecontainer.appendChild(upvote);


                    ndiv.className = "col-md-10 blogShort";
                    timestamp.innerHTML = "Created by "+resp.username+" on "+resp.time["time_created"];
                    ndescription.innerHTML = resp.description;
                    ndiv.style.borderStyle = "solid";
                    ndiv.style.borderWidth = "medium";
                    ndiv.style.borderColor = "black";
                    ndiv.style.margin = "5px";
                    ndiv.id = ""+resp.time["id"];
                    ndiv.appendChild(timestamp);
                    ndiv.appendChild(ndescription);
                    ndiv.appendChild(votecontainer);

                    row.appendChild(ndiv);



                    upvote.addEventListener("click", function () {
                        var newVote = votes.innerHTML;
                        var value = parseInt(newVote) + 1;
                        var updateVotes = ""+value;
                        votes.innerHTML = updateVotes;

                        $.ajax({
                            url:"/updatevotes",
                            type:"post",
                            data:{
                                counter: value
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





                }

            }
        })
    });

    $.ajax({
        url:"/postreply",
        type:"post",
        data:{
            type: "pread"
        },
        success:function(resp){
            console.log(resp);




            for(var i = 0; i<resp.user.length; i++) {

                if (resp.status == "success") {
                    var row = document.getElementById("blog");
                    var ndiv = document.createElement("div");
                    var timestamp = document.createElement("em");
                    var ndescription = document.createElement("p");
                    var votecontainer = document.createElement("div");
                    var upvote = document.createElement("a");
                    var votes = document.createElement("span");
                    var downvote = document.createElement("a");


                    upvote.className = "glyphicon glyphicon-chevron-up upvote";
                    downvote.className = "glyphicon glyphicon-chevron-down downvote";
                    votes.className = "label label-primary counter";
                    votecontainer.appendChild(downvote);
                    votes.innerHTML = "0";
                    votecontainer.appendChild(votes);
                    votecontainer.appendChild(upvote);



                    ndiv.className = "col-md-10 blogShort";
                    ndescription.innerHTML = resp.user[i].reply;
                    timestamp.innerHTML = "Created by "+resp.name+" on "+resp.user[i].time_created;
                    ndiv.style.borderStyle = "solid";
                    ndiv.style.borderWidth = "medium";
                    ndiv.style.borderColor = "black";
                    ndiv.style.margin = "5px";
                    ndiv.id = ""+resp.user[i].id;
                    ndiv.appendChild(timestamp);
                    ndiv.appendChild(ndescription);
                    ndiv.appendChild(votecontainer);
                    row.appendChild(ndiv);


                    upvote.addEventListener("click", function () {
                        var value = parseInt(document.getElementsByClassName("counter").innerHTML) + 1;
                        document.getElementsByClassName("counter").innerHTML = ""+value;

                        $.ajax({
                            url:"/updatevotes",
                            type:"post",
                            data:{
                                counter: value
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