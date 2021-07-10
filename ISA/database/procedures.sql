DROP PROCEDURE IF EXISTS GetImagesByFilm;
DELIMITER //
CREATE PROCEDURE GetImagesByFilm(f_id int)
BEGIN
    SELECT f.image_id, i.url, i.user_id, f.film_id
    FROM film_has_image AS f
        JOIN image AS i ON f.image_id = i.id
    WHERE f_id = f.film_id;
END;
//
DELIMITER ;


DROP PROCEDURE IF EXISTS GetSynopsisByFilm;
DELIMITER //
CREATE PROCEDURE GetSynopsisByFilm(f_id int)
BEGIN
    SELECT f.synopsis_id, s.text, s.user_id, f.film_id
    FROM film_has_synopsis AS f
        JOIN synopsis AS s ON f.synopsis_id = s.id
    WHERE f_id = f.film_id;
END;
//
DELIMITER ;



DROP PROCEDURE IF EXISTS GetReviewByFilm;
DELIMITER //
CREATE PROCEDURE GetReviewByFilm(f_id int)
BEGIN
    SELECT f.review_id, r.review, r.user_id, f.film_id
    FROM film_has_review AS f
        JOIN review AS r ON f.review_id = r.id
    WHERE f_id = f.film_id;
END;
//
DELIMITER ;

CALL GetImagesByFilm(443);