# Backup Manifest

| Field | Value |
|-------|-------|
| **Timestamp UTC** | 2026-06-02T20:53:29Z |
| **Timestamp WIB** | 2026-06-03 03:53 WIB |
| **Trigger** | schedule |
| **Files** | schema.sql, data.sql |

## Cara Restore

```bash
# 1. Restore schema dulu
psql [SUPABASE_DB_URL] -f backup/schema.sql

# 2. Restore data
psql [SUPABASE_DB_URL] -f backup/data.sql
```
