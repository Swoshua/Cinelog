let retrieveMovie = id => {
    let url = `/api/v1/film/${id}`
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        $("#film_title").text(data['name']);
        $("#dir_name").text(data['director']);
        $("#movie_poster").attr("src", "../images/posters/" + data['poster_url'])
        $("#cast_carousel").empty();
        let carousel = $("#cast_carousel");
        carousel.trigger('destroy.owl.carousel');
        carousel.find('.owl-stage-outer').children().unwrap();
        carousel.removeClass("owl-center owl-loaded owl-text-select-on");
        let string = "";
        data['cast'].forEach(function(actor) {
            string += `<div class="item container_foto">
                            <article class="text-left">
                                <h2>${actor['f_name']} ${actor['l_name']}</h2>
                                <h4>${actor['role']}</h4>
                            </article>
                            <img src="../images/actors/${actor['f_name']}_${actor['l_name']}.jpg" alt="">
                        </div>`;
        });
        carousel.html(string);
        carousel.owlCarousel({
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
        $("#reviews").empty();
        data['reviews'].forEach(function(reviews){
            let item = `<div class="row col align-self-start" data-aos="fade-up">
                            <h4>${reviews['review']}</h4>
                        </div>`
            $("#reviews").append(item);
        });
    })
    .catch(error => console.log(error));
}


function register() {
    console.log($("#emailname").val());
}
let writeReview = text => {
    let url = `/api/v1/user/${userID}/review/${rev_id}`
    fetch(url)
    .then(res => res.json())
    .then(data => console.log('success'));
    retrieveMovie($("#search").val());
}

let retrieveActor = id => {
    let url = `/api/v1/actor/${id}`
    fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
}

let retrieveDirector = id => {
    let url = `/api/v1/director/${id}`
    fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
}
