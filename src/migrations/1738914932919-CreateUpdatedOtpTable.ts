import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUpdatedOtpTable1738914932919 implements MigrationInterface {
  name = 'CreateUpdatedOtpTable1738914932919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, drop the existing enum type (if it exists)
    await queryRunner.query(`ALTER TABLE "otp_codes" ALTER COLUMN "action" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "otp_codes" ALTER COLUMN "action" TYPE VARCHAR`);

    // Create the new enum type
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."otp_actions_enum"`);
    await queryRunner.query(
      `CREATE TYPE "public"."otp_actions_enum" AS ENUM('VERIFY_EMAIL', 'PASSWORD_RESET')`,
    );

    // Update existing values if needed
    await queryRunner.query(
      `UPDATE "otp_codes" SET "action" = 'VERIFY_EMAIL' WHERE "action" = 'verify_email'`,
    );
    await queryRunner.query(
      `UPDATE "otp_codes" SET "action" = 'PASSWORD_RESET' WHERE "action" = 'password_reset'`,
    );

    // Convert column to use new enum
    await queryRunner.query(
      `ALTER TABLE "otp_codes" ALTER COLUMN "action" TYPE "public"."otp_actions_enum" USING "action"::"public"."otp_actions_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "otp_codes" ALTER COLUMN "action" TYPE VARCHAR`);
    await queryRunner.query(`DROP TYPE "public"."otp_actions_enum"`);
    await queryRunner.query(
      `CREATE TYPE "public"."otp_actions_enum" AS ENUM('verify_email', 'password_reset')`,
    );

    // Revert values
    await queryRunner.query(
      `UPDATE "otp_codes" SET "action" = 'verify_email' WHERE "action" = 'VERIFY_EMAIL'`,
    );
    await queryRunner.query(
      `UPDATE "otp_codes" SET "action" = 'password_reset' WHERE "action" = 'PASSWORD_RESET'`,
    );

    await queryRunner.query(
      `ALTER TABLE "otp_codes" ALTER COLUMN "action" TYPE "public"."otp_actions_enum" USING "action"::"public"."otp_actions_enum"`,
    );
  }
}
