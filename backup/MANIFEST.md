# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-06-11T20:25:53Z |
| **Timestamp WIB** | 2026-06-12 03:25 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
