/**
 * Created by Kenneth on 2017-04-10.
 */
$(function() {

    $('#login-form-link').click(function(e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function(e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

});

$(document).ready(function(){


    document.getElementById("register-submit").addEventListener("click", function(){
        $.ajax({
            url:"/register",
            type:"post",
            data:{
                un:document.getElementById("reg_username").value,
                pass:document.getElementById("reg_password").value,
                em:document.getElementById("email").value
            },
            success:function(resp){
                console.log(resp);
            }
        })
    });


    document.getElementById("login-submit").addEventListener("click", function(){
        $.ajax({
            url:"/login",
            type:"post",
            data:{
                un:document.getElementById("username").value,
                pass:document.getElementById("password").value
            },
            success:function(resp){
                if(resp.status = "success"){
                    console.log(resp);
                    location.href = "/board";
                }else if(resp.status = "fail"){
                    alert(resp.msg);
                }
            }
        })
    });
});