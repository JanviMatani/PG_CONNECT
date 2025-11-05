-- Add gender column to users table
-- Run this on your authentication database (DB_NAME)

ALTER TABLE users 
ADD COLUMN gender VARCHAR(10) DEFAULT NULL;

-- Optional: Update existing users to have a default gender
-- UPDATE users SET gender = 'Male' WHERE gender IS NULL;
