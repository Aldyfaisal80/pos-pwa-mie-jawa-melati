# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-06-04T20:10:01Z |
| **Timestamp WIB** | 2026-06-05 03:10 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
