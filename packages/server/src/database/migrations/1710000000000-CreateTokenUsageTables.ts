import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateTokenUsageTables1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create TokenUsage table
        await queryRunner.createTable(
            new Table({
                name: 'token_usage',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'model_name',
                        type: 'varchar'
                    },
                    {
                        name: 'prompt_tokens',
                        type: 'int'
                    },
                    {
                        name: 'completion_tokens',
                        type: 'int'
                    },
                    {
                        name: 'total_tokens',
                        type: 'int'
                    },
                    {
                        name: 'cost',
                        type: 'decimal',
                        precision: 10,
                        scale: 4
                    },
                    {
                        name: 'user_id',
                        type: 'varchar'
                    },
                    {
                        name: 'chatflow_id',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'agentflow_id',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'timestamp',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    }
                ]
            }),
            true
        )

        // Create TokenUsageAlert table
        await queryRunner.createTable(
            new Table({
                name: 'token_usage_alert',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid'
                    },
                    {
                        name: 'user_id',
                        type: 'varchar'
                    },
                    {
                        name: 'daily_limit',
                        type: 'decimal',
                        precision: 10,
                        scale: 2
                    },
                    {
                        name: 'monthly_limit',
                        type: 'decimal',
                        precision: 10,
                        scale: 2
                    },
                    {
                        name: 'email_notifications',
                        type: 'boolean',
                        default: true
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    },
                    {
                        name: 'last_notification_sent',
                        type: 'timestamp',
                        isNullable: true
                    }
                ]
            }),
            true
        )

        // Create indexes
        await queryRunner.createIndex(
            'token_usage',
            new TableIndex({
                name: 'IDX_TOKEN_USAGE_TIMESTAMP',
                columnNames: ['timestamp']
            })
        )

        await queryRunner.createIndex(
            'token_usage',
            new TableIndex({
                name: 'IDX_TOKEN_USAGE_USER_ID',
                columnNames: ['user_id']
            })
        )

        await queryRunner.createIndex(
            'token_usage_alert',
            new TableIndex({
                name: 'IDX_TOKEN_USAGE_ALERT_USER_ID',
                columnNames: ['user_id']
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('token_usage_alert')
        await queryRunner.dropTable('token_usage')
    }
} 