CREATE TABLE M_USER (
	ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	NAME VARCHAR(20),
	PASSWORD VARCHAR(255),
	ENTRY_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
