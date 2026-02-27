-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "second_cache" (
    "cache_id" SERIAL NOT NULL,
    "key_str" VARCHAR(32) NOT NULL,
    "value_expr" TEXT,
    "ttl_ms" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'UTC'::text),

    CONSTRAINT "second_cache_pkey" PRIMARY KEY ("cache_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "second_cache_key_str_key" ON "second_cache"("key_str");

