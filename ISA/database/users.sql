DROP PROCEDURE IF EXISTS GetUserPHash;
DELIMITER //
CREATE PROCEDURE GetUserPHash(mail NVARCHAR(64))
BEGIN
	SELECT id, password_hash FROM user
    WHERE email LIKE mail;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS AddUser;
DELIMITER //
CREATE PROCEDURE AddUser(mail NVARCHAR(64), pw_hash NVARCHAR(128))
BEGIN
	INSERT INTO user
    (email, password_hash)
    VALUES
    (mail, pw_hash);
    
    SELECT LAST_INSERT_ID() as 'id';
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetAllUsersImages;
DELIMITER //
CREATE PROCEDURE GetAllUsersImages(userID int)
BEGIN
	SELECT im.id, im.url as 'image_url', im.user_id as 'user', fhi.film_id as 'film'
    FROM image as im JOIN film_has_image as fhi ON im.id = fhi.image_id
    WHERE im.user_id = userID;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetAllUsersReviews;
DELIMITER //
CREATE PROCEDURE GetAllUsersReviews(userID int)
BEGIN
	SELECT r.id, r.review, r.user_id AS 'user', fhr.film_id AS 'film'
    FROM review AS r JOIN film_has_review AS fhr ON r.id = fhr.review_id
    WHERE r.user_id = userID;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetAllUsersSynopsis;
DELIMITER //
CREATE PROCEDURE GetAllUsersSynopsis(userID int)
BEGIN
	SELECT s.id, s.text, s.user_id AS 'user', fhs.film_id as 'film'
    FROM synopsis AS s
		JOIN film_has_synopsis AS fhs
        ON s.id = fhs.synopsis_id
	WHERE s.user_id = userID;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetUserEmail;
DELIMITER //
CREATE PROCEDURE GetUserEmail(userID int)
BEGIN
	SELECT id, email FROM user 
    WHERE id = userID;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetUserSpecificImage;
DELIMITER //
CREATE PROCEDURE GetUserSpecificImage(userID int, imageID int)
BEGIN
	SELECT im.id, im.url AS 'image_url', im.user_id AS 'user', fhi.film_id AS 'film'
    FROM image AS im 
		JOIN film_has_image AS fhi ON im.id = fhi.image_id
	WHERE im.id = imageID AND im.user_id = userID;
END;
//
DELIMITER ;


DROP PROCEDURE IF EXISTS GetUserSpecificReview;
DELIMITER //
CREATE PROCEDURE GetUserSpecificReview(userID int, reviewID int)
BEGIN
	SELECT r.id, r.review, r.user_id AS 'user', fhr.film_id AS 'film'
    FROM review AS r 
		JOIN film_has_review AS fhr ON r.id = fhr.review_id
	WHERE r.id = reviewID AND r.user_id = userID;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS GetUserSpecificSynopsis;
DELIMITER //
CREATE PROCEDURE GetUserSpecificSynopsis(userID int, synopsisID int)
BEGIN
	SELECT s.id, s.text, s.user_id AS 'user', fhs.film_id AS 'film'
    FROM synopsis AS s 
		JOIN film_has_synopsis AS fhs ON s.id = fhs.synopsis_id
	WHERE s.id = synopsisID AND s.user_id = userID;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS AddReview;
DELIMITER //
CREATE PROCEDURE AddReview(rev NVARCHAR(512), u_id int, f_id int)
BEGIN
	INSERT INTO review
    (review, user_id)
    VALUES
    (rev, u_id);
	
    SELECT @rev_id := LAST_INSERT_ID();
    
	INSERT INTO film_has_review
    (film_id, review_id)
    VALUES
    (f_id, @rev_id);
    
    SELECT LAST_INSERT_ID() AS 'id';
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS EditReview;
DELIMITER //
CREATE PROCEDURE EditReview(reviewID int, reviewText NVARCHAR(512))
BEGIN
	UPDATE review
    SET review.review = reviewText
    WHERE review.id = reviewID;
END;
//
DELIMITER ;




CALL EditReview(7, "test");



CALL AddUser('goku@gmail.com', '123');
CALL GetUserPHash('goku@gmail.com');
CALL GetAllUsersImages(5);
CALL GetAllUsersReviews(5);
CALL GetAllUsersSynopsis(5);
CALL GetUserSpecificImage(5, 1);