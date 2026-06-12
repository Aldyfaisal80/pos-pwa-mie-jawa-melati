# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-06-12T20:14:28Z |
| **Timestamp WIB** | 2026-06-13 03:14 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
