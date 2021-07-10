DROP PROCEDURE IF EXISTS GetActor;
DELIMITER //
CREATE PROCEDURE GetActor(a_id int)
BEGIN
    SELECT CONCAT(a.f_name, " ", a.l_name) AS 'name', a.profile_url
    FROM actor as a
    WHERE a.id = a_id;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS DeleteActor;
DELIMITER //
CREATE PROCEDURE DeleteActor(a_id int)
BEGIN
    DELETE FROM role WHERE role.actor_id = a_id;
    DELETE FROM actor WHERE actor.id = a_id;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetFilmsByActor;
DELIMITER //
CREATE PROCEDURE GetFilmsByActor(a_id int)
BEGIN 
    SELECT f.name, CONCAT(d.f_name, " ", d.l_name) AS 'director', f.poster_url
    FROM film AS f 
        JOIN role AS r ON f.id = r.film_id
        JOIN director AS d ON f.director_id = d.id
    WHERE r.actor_id = a_id;
END;
//
DELIMITER ;
