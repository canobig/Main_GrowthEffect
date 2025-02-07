import { MigrationInterface, QueryRunner } from 'typeorm'
export class AddUserSeed1737277708267 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "user" ("id", "name", "surname", "userEmail", "encryptPass", "isActive", "loginTimestamp", "passUpdatedDate")
        
        VALUES
        
        ('1', 'Can Onur', 'Buyuk', 'canobuyuk96@growtheffect.co', '$2a$10$.q80u4qJEvsX055w8s8wXuzbH849hUezcsKTeIaRst/EG98OziZR6', 1, datetime('now'), datetime('now'));`)
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user" WHERE "id" IN ('1');`)
    }
}