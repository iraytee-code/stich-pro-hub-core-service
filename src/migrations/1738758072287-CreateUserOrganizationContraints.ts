import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserOrganizationConstraints1738758072287 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First remove any existing constraints if they exist
    await queryRunner.query(`
      ALTER TABLE "organizations" 
      DROP CONSTRAINT IF EXISTS "FK_organizations_owner";
      
      ALTER TABLE "users" 
      DROP CONSTRAINT IF EXISTS "FK_users_organization";
    `);

    // Add the new constraints
    await queryRunner.query(`
      -- Add foreign key for organization.ownerId -> users.id
      ALTER TABLE "organizations"
      ADD CONSTRAINT "FK_organizations_owner"
      FOREIGN KEY ("owner_id") 
      REFERENCES "users" ("id")
      ON DELETE SET NULL;

      -- Add foreign key for users.organizationId -> organizations.id
      ALTER TABLE "users"
      ADD CONSTRAINT "FK_users_organization"
      FOREIGN KEY ("organizationId") 
      REFERENCES "organizations" ("id")
      ON DELETE SET NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the constraints
    await queryRunner.query(`
      ALTER TABLE "organizations" 
      DROP CONSTRAINT IF EXISTS "FK_organizations_owner";
      
      ALTER TABLE "users" 
      DROP CONSTRAINT IF EXISTS "FK_users_organization";
    `);
  }
}
