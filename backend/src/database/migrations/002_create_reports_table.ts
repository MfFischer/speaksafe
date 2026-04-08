import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('reports', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Reporter information (anonymous)
    table.uuid('reporter_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    table.string('anonymous_id').unique(); // ZK-proof generated ID
    table.string('reporter_hash').nullable(); // Hash for verification without revealing identity
    
    // Report content
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.enum('category', [
      'corruption',
      'fraud',
      'misconduct',
      'safety_violation',
      'environmental',
      'human_rights',
      'financial_crime',
      'other'
    ]).notNullable();
    
    // Location and organization
    table.string('country_code', 2).nullable();
    table.string('region').nullable();
    table.string('city').nullable();
    table.string('organization_name').nullable();
    table.string('organization_type').nullable();
    table.json('location_data').nullable(); // Encrypted location details
    
    // Incident details
    table.timestamp('incident_date').nullable();
    table.enum('severity', ['low', 'medium', 'high', 'critical']).defaultTo('medium');
    table.decimal('estimated_amount', 20, 2).nullable(); // Financial impact
    table.string('currency', 3).nullable();
    table.json('people_affected').nullable();
    
    // Evidence and attachments
    table.json('evidence_files').nullable(); // IPFS hashes
    table.json('supporting_documents').nullable();
    table.text('witness_information').nullable(); // Encrypted
    table.boolean('has_evidence').defaultTo(false);
    
    // Privacy and encryption
    table.text('encrypted_content').nullable(); // Encrypted sensitive details
    table.string('encryption_key_hash').nullable();
    table.json('zk_proof').nullable(); // Zero-knowledge proof data
    table.boolean('is_anonymous').defaultTo(true);
    
    // Status and workflow
    table.enum('status', [
      'draft',
      'submitted',
      'under_review',
      'verified',
      'investigating',
      'escalated',
      'resolved',
      'rejected',
      'archived'
    ]).defaultTo('submitted');
    
    table.enum('priority', ['low', 'normal', 'high', 'urgent']).defaultTo('normal');
    table.text('status_reason').nullable();
    table.uuid('assigned_to').nullable().references('id').inTable('users');
    
    // DAO governance
    table.integer('votes_for').defaultTo(0);
    table.integer('votes_against').defaultTo(0);
    table.integer('total_votes').defaultTo(0);
    table.decimal('vote_score', 5, 2).defaultTo(0); // Weighted score
    table.boolean('is_escalated').defaultTo(false);
    table.timestamp('escalated_at').nullable();
    
    // Blockchain integration
    table.string('blockchain_tx_hash').nullable();
    table.string('ipfs_hash').nullable();
    table.string('contract_address').nullable();
    table.integer('block_number').nullable();
    table.boolean('is_on_chain').defaultTo(false);
    
    // Metrics and tracking
    table.integer('view_count').defaultTo(0);
    table.integer('share_count').defaultTo(0);
    table.json('analytics_data').nullable();
    table.timestamp('last_updated_at').nullable();
    
    // Follow-up and resolution
    table.text('resolution_summary').nullable();
    table.json('follow_up_actions').nullable();
    table.timestamp('resolved_at').nullable();
    table.uuid('resolved_by').nullable().references('id').inTable('users');
    
    // Timestamps
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
    
    // Indexes
    table.index(['reporter_id']);
    table.index(['anonymous_id']);
    table.index(['category']);
    table.index(['status']);
    table.index(['priority']);
    table.index(['country_code']);
    table.index(['incident_date']);
    table.index(['created_at']);
    table.index(['is_escalated']);
    table.index(['vote_score']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('reports');
}
