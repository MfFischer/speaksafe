import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('donations', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Donor information
    table.uuid('donor_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    table.string('donor_address').notNullable(); // Wallet address
    table.boolean('is_anonymous').defaultTo(false);
    
    // Donation details
    table.decimal('amount', 20, 8).notNullable();
    table.string('currency', 10).notNullable(); // MATIC, USDC, etc.
    table.decimal('usd_value', 20, 2).nullable(); // USD equivalent at time of donation
    table.enum('donation_type', ['one_time', 'recurring', 'sponsorship']).defaultTo('one_time');
    
    // Purpose and allocation
    table.enum('purpose', [
      'general_fund',
      'report_sponsorship',
      'platform_development',
      'legal_support',
      'community_rewards',
      'infrastructure'
    ]).defaultTo('general_fund');
    
    table.uuid('sponsored_report_id').nullable().references('id').inTable('reports').onDelete('SET NULL');
    table.integer('sponsored_reports_count').defaultTo(0); // For bulk sponsorship
    
    // Blockchain transaction data
    table.string('transaction_hash').notNullable().unique();
    table.string('block_hash').nullable();
    table.integer('block_number').nullable();
    table.decimal('gas_used', 20, 0).nullable();
    table.decimal('gas_price', 20, 0).nullable();
    table.string('contract_address').nullable();
    
    // Status and processing
    table.enum('status', [
      'pending',
      'confirmed',
      'processed',
      'allocated',
      'failed',
      'refunded'
    ]).defaultTo('pending');
    
    table.integer('confirmations').defaultTo(0);
    table.timestamp('confirmed_at').nullable();
    table.timestamp('processed_at').nullable();
    
    // Recurring donation settings
    table.enum('recurring_frequency', ['weekly', 'monthly', 'quarterly', 'yearly']).nullable();
    table.timestamp('next_donation_date').nullable();
    table.boolean('is_active_subscription').defaultTo(false);
    table.integer('total_recurring_count').defaultTo(0);
    
    // Impact and rewards
    table.integer('reports_enabled').defaultTo(0); // Number of reports this donation enables
    table.decimal('community_impact_score', 10, 2).defaultTo(0);
    table.json('impact_metrics').nullable();
    table.boolean('eligible_for_rewards').defaultTo(true);
    
    // Donor recognition (if not anonymous)
    table.string('donor_message').nullable();
    table.boolean('show_on_leaderboard').defaultTo(false);
    table.string('display_name').nullable();
    
    // Refund information
    table.text('refund_reason').nullable();
    table.string('refund_tx_hash').nullable();
    table.timestamp('refunded_at').nullable();
    
    // Timestamps
    table.timestamps(true, true);
    
    // Indexes
    table.index(['donor_id']);
    table.index(['donor_address']);
    table.index(['transaction_hash']);
    table.index(['status']);
    table.index(['donation_type']);
    table.index(['purpose']);
    table.index(['sponsored_report_id']);
    table.index(['created_at']);
    table.index(['confirmed_at']);
    table.index(['is_active_subscription']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('donations');
}
