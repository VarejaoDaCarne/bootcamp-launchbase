DROP TABLE teachers;
CREATE TABLE teachers;

CREATE TABLE "teachers" (
	"id" SERIAL PRIMARY KEY,
    "name" text,
    "birth_date" timestamp,
    "education_level" text,
    "class_type" text,
    "subjects_taught" text,
    "created_at" timestamp DEFAULT (now()),
    "avatar_url" text
);

CREATE TABLE "students" (
	"id" SERIAL PRIMARY KEY,
    "avatar_url" text,
    "name" text,
    "birth" timestamp,
    "email" text,
    "school_year" text,
    "week_hours" int,
    "teacher_id" int,
);

DELETE FROM students;
DELETE FROM teachers;


ALTER SEQUENCE students_id_seq RESTART WITH 1;
ALTER SEQUENCE teachers_id_seq RESTART WITH 1;