# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-06-30T20:02:26Z |
| **Timestamp WIB** | 2026-07-01 03:02 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
