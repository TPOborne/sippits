const Schema = {
  Users: `CREATE TABLE IF NOT EXISTS users (
    user_id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    display_name VARCHAR(30) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registration_date TIMESTAMP NULL,
    registration_token VARCHAR(25) NOT NULL,
    verified BOOLEAN DEFAULT 0,
    role VARCHAR(20) NOT NULL
  )`,

  Skills: `CREATE TABLE IF NOT EXISTS skills (
    skill_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    skill VARCHAR(100) NOT NULL,
    INDEX(user_id)
  )`,
  alterSkills: `ALTER TABLE skills ADD FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE;`,
  

}

module.exports = Schema;

