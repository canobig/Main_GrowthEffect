import { MigrationInterface, QueryRunner } from 'typeorm'
export class AddUsers1737277632409 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "user" ("id" varchar PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    
    "surname" varchar NOT NULL,
    
    "userEmail" varchar NOT NULL,
    
    "encryptPass" varchar NOT NULL,
    
    "isActive" BOOLEAN NOT NULL,

    "loginTimestamp" datetime NOT NULL DEFAULT (datetime('now')),
    
    "passUpdatedDate" datetime NOT NULL DEFAULT (datetime('now')));`)
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "user";`)
    }
}