import {MigrationInterface, QueryRunner} from "typeorm";

export class fixNameDetail1634748696673 implements MigrationInterface {
    name = 'fixNameDetail1634748696673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "name" SET NOT NULL`);
    }

}
