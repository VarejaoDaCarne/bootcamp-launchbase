CREATE TABLE "chefs" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "file_id" INTEGER REFERENCES files(id),
    "created_at" timestamp DEFAULT(now())
);

CREATE TABLE "files" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT,
    "path" TEXT NOT NULL
);

CREATE TABLE "recipe_files" (
    "id" SERIAL PRIMARY KEY,
    "recipe_id" INTEGER REFERENCES recipes(id),
    "file_id "INTEGER REFERENCES files(id)
);

CREATE TABLE "recipes" (
    "id" SERIAL PRIMARY KEY,
    "chef_id"  INTEGER REFERENCES chefs(id),
    "ingredients" text[],
    "preparation" text[],
    "information" text,
    "created_at" timestamp DEFAULT(now())
);

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");