DROP PROCEDURE IF EXISTS GetFilm;
DELIMITER //
CREATE PROCEDURE GetFilm(id int)
BEGIN
	SELECT f.name, f.poster_url, CONCAT(d.f_name, " ", d.l_name) AS 'director'
	FROM film as f JOIN director as d ON f.director_id = d.id
    WHERE f.id = id;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetFilmsActors;
DELIMITER //
CREATE PROCEDURE GetFilmsActors(f_id int) 
BEGIN
	SELECT a.id, a.f_name, a.l_name, a.profile_url, r.role
    FROM actor as a JOIN role as r
    ON a.id = r.actor_id
    WHERE r.film_id = f_id;
END
//
DELIMITER ;

DROP PROCEDURE IF EXISTS DeleteFilm;
DELIMITER //
CREATE PROCEDURE DeleteFilm(f_id int)
BEGIN
	DELETE FROM role WHERE role.film_id = f_id;
	DELETE FROM film_has_image WHERE film_has_image.film_id = f_id;
    DELETE FROM film_has_synopsis WHERE film_has_synopsis.film_id = f_id;
	DELETE FROM film_has_review WHERE film_has_review.film_id = f_id;
	DELETE FROM film WHERE film.id = f_id;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetAllReviews;
DELIMITER //
CREATE PROCEDURE GetAllReviews(filmID int)
BEGIN
	SELECT r.id, r.review, r.user_id AS 'user'
    FROM review AS r
		JOIN film_has_review AS fhr
			ON r.id = fhr.review_id
        WHERE fhr.film_id = filmID;
END;
//
DELIMITER ;


CALL GetFilmsActors(234);
CALL GetFilm(443);
CALL GetAllReviews(443);
-- DELETE FROM director;
-- DELETE FROM role;
-- DELETE FROM film;
-- DELETE FROM actor;
