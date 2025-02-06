import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOtpCodesTable1738700796671 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
     CREATE TYPE "otp_actions_enum" AS ENUM ('verify_email');

     CREATE TABLE "otp_codes" (
       "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
       "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
       "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
       "deleted_at" TIMESTAMP WITH TIME ZONE,
       "organization_id" uuid NOT NULL,
       "pin_id" varchar NOT NULL,
       "medium" varchar NOT NULL,
       "action" otp_actions_enum NOT NULL,
       "expires_at" timestamp NOT NULL,
       "is_verified" boolean NOT NULL DEFAULT false,
       "is_active" boolean NOT NULL DEFAULT true,
       CONSTRAINT "PK_otp_codes_id" PRIMARY KEY ("id"),
       CONSTRAINT "FK_otp_codes_organization" FOREIGN KEY ("organization_id") 
         REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE
     );

     CREATE INDEX "IDX_otp_codes_organization" ON "otp_codes" ("organization_id");
   `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
     DROP TABLE "otp_codes";
     DROP TYPE "otp_actions_enum";
   `);
  }
}
