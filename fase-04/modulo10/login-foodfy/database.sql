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

CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "reset_token" TEXT,
    "reset_token_expires" TEXT,
    "is_admin" BOOLEAN DEFAULT false,
    "created_at "TIMESTAMP DEFAULT(now()),
    "updated_at" TIMESTAMP DEFAULT(now())
);

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
