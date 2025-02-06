import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNewOrganizationTable1738785427248 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE IF EXISTS "organization_status_enum";`);

    await queryRunner.query(`
    CREATE TYPE "organization_status_enum" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');
  `);

    await queryRunner.query(`
    CREATE TABLE "organizations" (
      "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "deleted_at" TIMESTAMP WITH TIME ZONE,
      "name" varchar NOT NULL,
      "status" organization_status_enum NOT NULL DEFAULT 'PENDING',
      "owner_id" uuid,
      "org_phone_number" varchar NOT NULL,
      "contact_email" varchar,
      "address" varchar NOT NULL,
      "city" varchar NOT NULL,
      "state" varchar NOT NULL,
      "country" varchar NOT NULL,
      "is_verified" boolean NOT NULL DEFAULT false
    );
  `);

    await queryRunner.query(`
    CREATE INDEX "IDX_organizations_name" ON "organizations"("name");
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "organizations";
      DROP TYPE IF EXISTS "organization_status_enum";
    `);
  }
}
