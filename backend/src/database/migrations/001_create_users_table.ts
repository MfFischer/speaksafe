import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Authentication fields
    table.string('email').unique().nullable(); // Nullable for anonymous users
    table.string('password_hash').nullable();
    table.string('wallet_address').unique().nullable();
    table.string('username').unique().nullable();
    
    // Profile information
    table.string('display_name').nullable();
    table.text('bio').nullable();
    table.string('avatar_url').nullable();
    table.string('country_code', 2).nullable();
    table.string('timezone').nullable();
    
    // User type and permissions
    table.enum('user_type', ['anonymous', 'registered', 'verified', 'admin']).defaultTo('anonymous');
    table.enum('role', ['user', 'moderator', 'admin']).defaultTo('user');
    table.json('permissions').nullable();
    
    // Privacy settings
    table.boolean('is_anonymous').defaultTo(true);
    table.boolean('allow_contact').defaultTo(false);
    table.json('privacy_settings').nullable();
    
    // Verification and reputation
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at').nullable();
    table.string('verification_method').nullable();
    table.integer('reputation_score').defaultTo(0);
    table.json('verification_data').nullable();
    
    // Activity tracking
    table.integer('reports_submitted').defaultTo(0);
    table.integer('votes_cast').defaultTo(0);
    table.decimal('total_donated', 20, 8).defaultTo(0);
    table.timestamp('last_active_at').nullable();
    table.string('last_ip_address').nullable();
    
    // Account status
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_banned').defaultTo(false);
    table.timestamp('banned_until').nullable();
    table.text('ban_reason').nullable();
    
    // Security
    table.string('two_factor_secret').nullable();
    table.boolean('two_factor_enabled').defaultTo(false);
    table.json('login_attempts').nullable();
    table.timestamp('password_changed_at').nullable();
    
    // Timestamps
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
    
    // Indexes
    table.index(['email']);
    table.index(['wallet_address']);
    table.index(['user_type']);
    table.index(['is_active']);
    table.index(['created_at']);
    table.index(['last_active_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
