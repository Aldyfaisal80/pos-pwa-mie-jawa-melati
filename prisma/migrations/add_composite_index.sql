CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transaction_report ON "Transaction" ("isSynced", "deletedAt", "date");
