# MySQL Optimization Guide

## Memory Allocation Error Fix

The error `SQLSTATE[HY001]: Memory allocation error: 1038 Out of sort memory` occurs when MySQL runs out of memory while sorting large result sets.

## Changes Made

### 1. Backend Optimizations

**File: `app/Http/Controllers/UploadFilesController.php`**
- ✅ Implemented pagination (50 files per page)
- ✅ Added selective column selection to reduce memory usage
- ✅ Added memory usage logging for monitoring
- ✅ Optimized query with proper indexing

**File: `database/migrations/2025_07_31_060029_add_indexes_to_uploaded_files_table.php`**
- ✅ Added composite index on `(user_id, created_at)` for efficient pagination
- ✅ Added index on `status` for filtering
- ✅ Added index on `is_encrypted` for filtering

### 2. Frontend Optimizations

**File: `resources/js/Pages/UploadFiles.tsx`**
- ✅ Updated interface to handle pagination data
- ✅ Added pagination controls with Previous/Next buttons
- ✅ Added page number navigation
- ✅ Added file count display

## MySQL Configuration Recommendations

### For Production Environment

Add these settings to your MySQL configuration (`my.cnf` or `my.ini`):

```ini
[mysqld]
# Increase sort buffer size
sort_buffer_size = 2M

# Increase read buffer size
read_buffer_size = 2M

# Increase read rnd buffer size
read_rnd_buffer_size = 8M

# Increase join buffer size
join_buffer_size = 2M

# Optimize for InnoDB
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_log_buffer_size = 16M

# Connection settings
max_connections = 200
max_allowed_packet = 64M

# Query cache (if using MySQL 5.7 or earlier)
query_cache_size = 64M
query_cache_type = 1
```

### For Laravel Environment Variables

Add these to your `.env` file:

```env
# Database optimization
DB_STRICT=false
DB_ENGINE=InnoDB
```

## Monitoring and Prevention

### 1. Memory Usage Monitoring

The application now logs memory usage:
```php
'memory_usage' => memory_get_usage(true) / 1024 / 1024 . ' MB'
```

### 2. Query Optimization

- Use `select()` to limit columns
- Implement pagination for large datasets
- Add proper database indexes
- Use `orderBy()` with indexed columns

### 3. Laravel Query Optimization

```php
// Good - Uses pagination and selective columns
UploadedFile::where('user_id', Auth::id())
    ->select(['id', 'filename', 'original_filename', 'file_type', 'file_size', 'status', 'created_at'])
    ->orderBy('created_at', 'desc')
    ->paginate(50);

// Avoid - Loads all records into memory
UploadedFile::where('user_id', Auth::id())
    ->orderBy('created_at', 'desc')
    ->get();
```

## Performance Monitoring

### Check Current MySQL Settings

```sql
SHOW VARIABLES LIKE 'sort_buffer_size';
SHOW VARIABLES LIKE 'read_buffer_size';
SHOW VARIABLES LIKE 'join_buffer_size';
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
```

### Monitor Query Performance

```sql
-- Check slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- Analyze table performance
ANALYZE TABLE uploaded_files;
```

## Additional Recommendations

1. **Regular Maintenance**
   - Run `OPTIMIZE TABLE uploaded_files` periodically
   - Monitor table size and archive old data if needed

2. **Application Level**
   - Implement file archiving for old uploads
   - Add data retention policies
   - Consider using Redis for caching frequently accessed data

3. **Infrastructure**
   - Ensure adequate RAM for MySQL server
   - Consider using read replicas for heavy read operations
   - Monitor disk I/O performance

## Testing the Fix

1. **Deploy the changes**
2. **Run the migration**: `php artisan migrate`
3. **Test with large datasets**
4. **Monitor memory usage in logs**
5. **Verify pagination works correctly**

The implemented solution should resolve the memory allocation error by:
- Limiting result sets to 50 files per page
- Using efficient database indexes
- Reducing memory usage through selective column loading
- Providing proper pagination controls in the UI 