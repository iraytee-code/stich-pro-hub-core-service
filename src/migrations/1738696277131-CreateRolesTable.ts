import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolesTable1738673738394 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
     CREATE TYPE "public"."role_scope_enum" AS ENUM ('SYSTEM', 'ORGANIZATION');
     CREATE TYPE "public"."role_status_enum" AS ENUM ('ENABLED', 'DISABLED');

     CREATE TABLE "roles" (
       "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
       "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
       "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
       "deleted_at" TIMESTAMP WITH TIME ZONE,
       "name" varchar NOT NULL,
       "description" text,
       "scope" "public"."role_scope_enum" NOT NULL DEFAULT 'SYSTEM',
       "status" "public"."role_status_enum" NOT NULL DEFAULT 'ENABLED',
       CONSTRAINT "PK_roles_id" PRIMARY KEY ("id"),
       CONSTRAINT "UQ_roles_name" UNIQUE ("name")
     );

     CREATE INDEX "IDX_roles_deleted_at" ON "roles" ("deleted_at");
   `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
     DROP TABLE "roles";
     DROP TYPE "public"."role_scope_enum";
     DROP TYPE "public"."role_status_enum";
   `);
  }
}
