
DROP PROCEDURE IF EXISTS AddFilmWithDirector;
DELIMITER //
CREATE PROCEDURE AddFilmWithDirector(dir_fname NVARCHAR(128), dir_lname NVARCHAR(128), film_name NVARCHAR(128), poster_url NVARCHAR(128))
BEGIN
	INSERT IGNORE INTO director 
    (f_name, l_name)
    VALUES
    (dir_fname, dir_lname);
    
    SELECT @dirId := id from director where director.f_name LIKE dir_fname AND director.l_name LIKE dir_lname;
    
    INSERT INTO film
    (name, poster_url, director_id)
    VALUES
    (film_name, poster_url, @dirID);
    
    SELECT LAST_INSERT_ID();
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS AddCastMember;
DELIMITER //
CREATE PROCEDURE AddCastMember(f_id int, actor_fname NVARCHAR(128), actor_lname NVARCHAR(128), r NVARCHAR(128), post_url NVARCHAR(128))
BEGIN
	INSERT IGNORE INTO actor 
    (f_name, l_name, profile_url)
    VALUES
    (actor_fname, actor_lname, post_url);

    SELECT @actId := id from actor where actor.f_name LIKE actor_fname AND actor.l_name LIKE actor_lname;

	INSERT INTO role 
    (film_id, actor_id, role)
    VALUES
    (f_id, @actId, r);
END;
//
DELIMITER ;
