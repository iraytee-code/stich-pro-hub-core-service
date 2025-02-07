import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1738756260927 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "user_type_enum" AS ENUM ('SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'ORGANIZATION_USER');
      CREATE TYPE "user_status_enum" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "email" varchar NOT NULL UNIQUE,
        "password" varchar NOT NULL,
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "organizationId" uuid NULL,  -- Change this to uuid
        "roleId" varchar NOT NULL,
        "type" user_type_enum NOT NULL DEFAULT 'ORGANIZATION_USER',
        "status" user_status_enum NOT NULL DEFAULT 'PENDING',
        CONSTRAINT "FK_users_organization" FOREIGN KEY ("organizationId")
          REFERENCES "organizations" ("id") ON DELETE SET NULL,
        CONSTRAINT "FK_users_role" FOREIGN KEY ("roleId")
          REFERENCES "roles" ("id")
      );

      CREATE INDEX "IDX_users_email_organizationId" ON "users" ("email", "organizationId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "users";
      DROP TYPE "user_type_enum";
      DROP TYPE "user_status_enum";
    `);
  }
}
