# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-04-25T18:59:09Z |
| **Timestamp WIB** | 2026-04-26 01:59 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
