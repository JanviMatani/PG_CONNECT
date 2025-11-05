-- Add gender column to flats table
-- Run this on your flats database (DB_NAME2)

ALTER TABLE flats 
ADD COLUMN gender VARCHAR(10) DEFAULT NULL;

-- Optional: Update existing flats to have a default gender
-- UPDATE flats SET gender = 'Male' WHERE id IN (1, 2, 3);
-- UPDATE flats SET gender = 'Female' WHERE id IN (4, 5, 6);
