/**
* Template Name: Regna - v2.1.0
* Template URL: https://bootstrapmade.com/regna-bootstrap-onepage-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/


  // Header fixed and Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
      $('#header').addClass('header-fixed');
    } else {
      $('.back-to-top').fadeOut('slow');
      $('#header').removeClass('header-fixed');
    }
  });

  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });


  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }
  // Smooth scroll for the navigation menu and links with .scrollto classes

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, #mobile-nav');

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop() + 200;

    nav_sections.each(function() {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('menu-active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('menu-active');
      }
      if (cur_pos < 300) {
        $(".nav-menu li:first").addClass('menu-active');
      }
    });
  });

  $("#searchbar").click(function(){
    $(".search").css("display", "none")
    $(".btn-get-started").css("background-color", "#fff");
    $("#search").css("display", "inline").focus();
    $(".btn-get-started").css("border", "2px solid #2dc997");
  });

  $("#search").focusout(function(){
    if (!$("#search").val()){
      $("#search").css("display", "none");
      $(".btn-get-started").css("background-color", "");
      $(".btn-get-started").css("border", "2px solid #fff");
      $(".search").css("display", "inline");

    }
  });

  $(document).ready(function(){
    $("#registerSignIn").submit(function(e){
      return false;
    });
    $(".owl-carousel").owlCarousel({
      loop: true,
      nav: true,
      dots: false,
      lazyLoad: true,
      responsive: {
        0:{
          items: 1
        },
        250:{
          items: 2
        },
        500:{
          items: 3
        },
        800:{
          items: 5
        },
        1000: {
          items: 7
        }
      }
    });
  });

  $("#search").keypress(function(event){
    if (event.keyCode == '13'){
      document.getElementById("movie").scrollIntoView({behavior: 'smooth'});
      retrieveMovie($("#search").val());
    }
  });


  $("#form_button").on('click', function(){
    console.log("heror")
    $("#form").modal('toggle');
  });
  

  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      once: true
    });
  }
  $(window).on('load', function() {
    aos_init();
  });

  $(".dropdown-menu li a").click(function(){
    $(".btn:first-child").text($(this).text());
    $(".btn:first-child").val($(this).text());
  });



function signInModal(){
  $("#sign_in").modal('toggle');
}

$("#exampleFormControlSelect").change(function(){
  let temp;
  let clone;
  let form;
  switch ($("#exampleFormControlSelect option:selected").text()){
    case "Synopsis":
        temp = `<form>
                    <div class="form-group">
                        <textarea class="form-control" id="synopsis_text" rows="3" placeholder="Write your synopsis here.."></textarea>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                  </form>`;
        break;
    case "Review":
        temp = `<form>
                  <div class="form-group">
                      <textarea class="form-control" id="synopsis_text" rows="3" placeholder="Write your review here.."></textarea>
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button type="submit" class="btn btn-primary">Submit</button>
                  </div>
                </form>`;
        break;
    case "Image":
        temp = `<form action="/upload" method="POST" enctype="multipart/form-data">
                  <div class="form-group">
                      <input type="file" name="pic_image" class="form-control-file" id="exampleFormControlFile1" accept="image/x-png,image/jpeg, image/jpg">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button type="submit" class="btn btn-primary">Submit</button>
                  </div>
                </form>`;
  }
  $("#form_change").html(temp);
});

$("#image_form").submit(function(e){
        e.preventDefault();
});
