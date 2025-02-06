import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolePermissionsTable1738700796670 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "role_permissions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "role_id" uuid NOT NULL,
                "permission_id" uuid NOT NULL,
                CONSTRAINT "PK_role_permissions_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_role_permissions_role_id" FOREIGN KEY ("role_id") 
                    REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_role_permissions_permission_id" FOREIGN KEY ("permission_id") 
                    REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "UQ_role_permission" UNIQUE ("role_id", "permission_id")
            );

            CREATE INDEX "IDX_role_permissions_role_id" ON "role_permissions" ("role_id");
            CREATE INDEX "IDX_role_permissions_permission_id" ON "role_permissions" ("permission_id");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "role_permissions";
        `);
  }
}
