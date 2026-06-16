# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-06-16T20:55:38Z |
| **Timestamp WIB** | 2026-06-17 03:55 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
