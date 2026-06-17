# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-06-17T20:16:54Z |
| **Timestamp WIB** | 2026-06-18 03:16 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
