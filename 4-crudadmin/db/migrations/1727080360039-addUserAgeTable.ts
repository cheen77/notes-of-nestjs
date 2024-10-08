import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAgeTable1727080360039 implements MigrationInterface {
    name = 'AddUserAgeTable1727080360039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`age\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`age\``);
    }

}
