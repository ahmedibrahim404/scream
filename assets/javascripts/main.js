import '../sass/style.scss'

'use strict';

$(document).ready(function () {


    $('.register .contain-items span#toggleSection').on('click', function (e) {
        if ($(this).parent().hasClass('step-1')) {
            e.preventDefault();
            /* Go to Step 2 */
            $('.step-1').fadeOut();
            setTimeout(function () {
                return $('.step-2').fadeIn();
            }, 500);
        }

    });

    $('.contain-items > span').on('click', function () {
        $('#modal').fadeOut(200);
        setTimeout(function () {
            return window.location.href = "/login";
        }, 200);
    });

    $('nav#top-navbar i').on('click', function () {
        if ($(this).parent().hasClass('opened')) {
            $('nav#top-navbar').animate({
                marginLeft: '0'
            }, 50);
            $("nav#main-navbar").css({
                left: '-250px'
            }, 100);
            $(this).parent().toggleClass('opened');
        } else {
            $('nav#top-navbar').animate({
                marginLeft: '230px'
            }, 50);
            $("nav#main-navbar").css({
                left: 0
            }, 100);
            $(this).parent().toggleClass('opened');
        }
    });

    $('.options .comment').click(function () {
        $(this).parent().next('.comment-area').fadeToggle();
    });

    $('div.send_message .contain button').on('click', function (e) {
        $('div.send_message .contain').fadeOut(150);
        $('div.send_message .black_lay').fadeOut(500);
    });

    $('button#send_message').on('click', function (e) {
        $('div.send_message .black_lay').fadeIn(150);
        $('div.send_message .contain').fadeIn(500);
    });

    $('ul li').click(function (e) {
        var _this = this;

        if ($(this).attr('to')) {
            window.location.href = $(this).attr('to');
        }
        if ($(this).attr('dataTo')) {
            $(this).addClass('active').siblings().removeClass('active');
            $('div.' + $(this).attr('dataTo')).siblings().fadeOut();
            setTimeout(function () {
                $('div.' + $(_this).attr('dataTo')).siblings().fadeOut();
                $('div.' + $(_this).attr('dataTo')).fadeIn();
            }, 500);
        }
    });

    $('section.settings .container button').click(function (e) {
        $('section.settings div.pop').toggle()
        $(`div[data=${$(this).attr('data')}]`).show().siblings().hide()
    });

    $('section.settings div.pop .popup #close').click(function(e){
        $('section.settings div.pop').toggle()

        $('section.settings div.contain div[data=image] img').attr('src', $('section.settings div.contain div[data=image] img').attr('temp') );


    });

    function onChange(e){

        console.log('helo')

        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            $('section.settings div.contain div[data=image] img').attr('temp', $('section.settings div.contain div[data=image] img').attr('src'));
            $('section.settings div.contain div[data=image] img').attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
    }

    $('section.settings div.contain div[data=image]').on('change', 'input[type=file]', onChange)

    function uploadPersonalPhoto(){
        var formData = new FormData();
        var e=$('section.settings div.contain div[data=image] input[type=file]').get(0);
        var file = e.files[0];
        let filename="user";
        formData.append('file', file, filename);
        formData.append('filename', filename);
        fetch(`/uploadimage`, {
            method:"POST",
            body: formData,
        })
        .then((data) => data.json())
        .then((data) => {
            if(data.success){
                $('section.settings div.pop').toggle();
                $(`div[data=image]`).show().siblings().hide();
                $('img.cur-profile').attr('src', `/storage/user_imgs/${data.username}.png`);
            } else {

                return new Error('Error Occured!');
            }
        })
        .catch((err) => console.log(err))
        }

    $('section.settings div.contain div[data=image] button.upload-img').click(uploadPersonalPhoto);

    function updatePersonalData(e){
        let dataAvailabe = [ 'username', 'email', 'password' ];
        let idx=0;
        for(let i in dataAvailabe){
            let cur=dataAvailabe[i];
            if(cur==e.target.getAttribute('data')){
                idx=i;
                break;
            }
        }

        let newValue=$(`section.settings div.contain div[data=${dataAvailabe[idx]}] input.changeUser`)[0].value;
        let oldPassword=$(`section.settings div.contain div[data=${dataAvailabe[idx]}] input.oldPassword`)[0].value;
        console.log(newValue);
        fetch(`/updateuser`, {
            method:"POST",
            body: JSON.stringify({
                type:idx,
                value:newValue,
                old:oldPassword
            })
        })
        .then((data) => data.json())
        .then((data) => {
            if(data.success){
                window.location.href="/login";
            }
        })
        .catch((err) => console.log(err))
    }

    $('section.settings div.contain div button.change-profile').click(updatePersonalData);

});
