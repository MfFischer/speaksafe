import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('dao_votes', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Voter information
    table.uuid('voter_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    table.string('voter_address').notNullable(); // Wallet address
    table.string('anonymous_voter_id').nullable(); // For anonymous voting
    
    // Vote target
    table.uuid('report_id').notNullable().references('id').inTable('reports').onDelete('CASCADE');
    table.enum('vote_type', ['approve', 'reject', 'escalate', 'investigate']).notNullable();
    
    // Vote details
    table.enum('decision', ['for', 'against', 'abstain']).notNullable();
    table.integer('voting_power').defaultTo(1);
    table.decimal('stake_amount', 20, 8).nullable(); // Staked tokens
    table.text('reason').nullable(); // Optional reasoning
    
    // Blockchain data
    table.string('transaction_hash').nullable();
    table.string('block_hash').nullable();
    table.integer('block_number').nullable();
    table.decimal('gas_used', 20, 0).nullable();
    table.decimal('gas_price', 20, 0).nullable();
    
    // Vote validation
    table.boolean('is_valid').defaultTo(true);
    table.string('signature').nullable(); // Cryptographic signature
    table.json('proof_data').nullable(); // ZK proof for anonymous votes
    
    // Timestamps
    table.timestamps(true, true);
    
    // Indexes
    table.index(['voter_id']);
    table.index(['voter_address']);
    table.index(['report_id']);
    table.index(['vote_type']);
    table.index(['decision']);
    table.index(['created_at']);
    table.index(['transaction_hash']);
    
    // Unique constraint to prevent double voting
    table.unique(['voter_address', 'report_id', 'vote_type']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('dao_votes');
}
