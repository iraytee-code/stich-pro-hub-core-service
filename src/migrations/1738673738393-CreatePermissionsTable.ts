import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissionsTable1738673738393 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."permission_scope_enum" AS ENUM ('SYSTEM', 'ORGANIZATION');
            CREATE TYPE "public"."permission_category_enum" AS ENUM ('USER_MANAGEMENT', 'CLIENT_MANAGEMENT');
            CREATE TYPE "public"."permission_status_enum" AS ENUM ('ENABLED', 'DISABLED');

            CREATE TABLE "permissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "name" varchar NOT NULL,
                "description" text,
                "scope" "public"."permission_scope_enum" NOT NULL DEFAULT 'SYSTEM',
                "category" "public"."permission_category_enum" NOT NULL,
                "status" "public"."permission_status_enum" NOT NULL DEFAULT 'ENABLED',
                CONSTRAINT "PK_permissions_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_permissions_name" UNIQUE ("name")
            );

            CREATE INDEX "IDX_permissions_deleted_at" ON "permissions" ("deleted_at");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "permissions";
            DROP TYPE "public"."permission_scope_enum";
            DROP TYPE "public"."permission_category_enum";
            DROP TYPE "public"."permission_status_enum";
        `);
  }
}
