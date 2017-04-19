/**
 * Created by Kenneth on 2017-04-18.
 */
$(document).ready(function() {
    $.ajax({
        url: "/room/roomId",
        type: "post",
        success: function (resp) {

            document.getElementById("status").innerHTML = "You are in room " + resp.index + ": " + resp.data[resp.index].title;


            initSockets(resp.index, resp.user);


        }
    });
});


function initSockets(roomId, username){
    var socket = io();


    socket.emit("join room", roomId);




    document.getElementById("send").addEventListener("click", function(){


        var obj = {
            msg: document.getElementById("msgtxt").value,
            username: username
        };

        socket.emit("send message", obj);
    });


    socket.on("create message", function (obj) {
        console.log(obj);



        var display = document.getElementById("display");
        var adiv = document.createElement("div");
        var msg = document.createElement("p");
        var container = document.createElement("div");
        var row = document.createElement("div");


        container.className = "container";
        row.className = "row";
        container.appendChild(row);

        adiv.id = "user";
        msg.id = "msg";
        adiv.innerHTML = obj.username;
        msg.style.color = "black";
        msg.innerHTML = ": " + obj.msg;
        adiv.style.padding = "5px";
        adiv.style.margin = "5px";
        msg.style.padding = "5px";
        msg.style.margin = "5px";




        row.appendChild(adiv);
        row.appendChild(msg);

        display.appendChild(container);



    });



}