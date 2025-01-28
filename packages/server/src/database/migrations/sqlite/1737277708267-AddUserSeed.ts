import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserSeed1737277708267 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "user" ("id", "name", "surname", "userEmail", "encryptPass", "counter", "loginTimestamp", "passUpdatedDate")
        
        VALUES
        
        ('2', 'Can o', 'Buyuk', 'can@gmail.com', '123456', 0, datetime('now'), datetime('now'));`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user" WHERE "id" IN ('1');`)
    }
}
