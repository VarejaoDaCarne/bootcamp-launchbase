CREATE TABLE "customers" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "birth" int,
  "email" text,
  "phone" int
);

CREATE TABLE "agencies" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "since" int,
  "email" text,
  "phone" int
);

CREATE TABLE "addresses" (
  "id" SERIAL PRIMARY KEY,
  "street" text,
  "neighbourhood" text,
  "number" int,
  "code" int,
  "agency_id" int
);

CREATE TABLE "cars" (
  "id" SERIAL PRIMARY KEY,
  "color" text,
  "released" int,
  "plate" text,
  "price" int,
  "model_id" int
);

CREATE TABLE "models" (
  "id" SERIAL PRIMARY KEY,
  "model" text,
  "type" text,
  "country" text,
  "brand" text
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "client_id" int,
  "agency_id" int,
  "car_id" int
);

ALTER TABLE "addresses" ADD FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id");

ALTER TABLE "models" ADD FOREIGN KEY ("id") REFERENCES "cars" ("model_id");

ALTER TABLE "customers" ADD FOREIGN KEY ("id") REFERENCES "orders" ("client_id");

ALTER TABLE "agencies" ADD FOREIGN KEY ("id") REFERENCES "orders" ("agency_id");

ALTER TABLE "orders" ADD FOREIGN KEY ("car_id") REFERENCES "cars" ("id");
