DROP PROCEDURE IF EXISTS GetDirector;
DELIMITER //
CREATE PROCEDURE GetDirector(id int)
BEGIN
    SELECT CONCAT(d.f_name, " ", d.l_name) AS 'name'
    FROM director as d
    WHERE d.id = id;
END;
//
DELIMITER ;


DROP PROCEDURE IF EXISTS DeleteDirector;
DELIMITER //
CREATE PROCEDURE DeleteDirector(d_id int)
BEGIN
    DELETE FROM film WHERE film.director_id = d_id;
    DELETE FROM director WHERE director.id = d_id;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetFilmsByDirector;
DELIMITER //
CREATE PROCEDURE GetFilmsByDirector(d_id int)
BEGIN
    SELECT f.name, CONCAT(d.f_name, " ", d.l_name) AS 'director', f.poster_url
    FROM film as f join director as d ON f.director_id = d.id
    WHERE d.id = d_id;
END;
//
DELIMITER ;

