# Custom Error Handling

This application includes a custom error handling system that displays a user-friendly modal instead of Laravel's default error pages when `APP_DEBUG=false`.

## How It Works

### 1. Exception Handler
- **File**: `app/Exceptions/Handler.php`
- **Function**: Overrides Laravel's default error handling
- **Condition**: Only activates when `APP_DEBUG=false` in your `.env` file

### 2. Error Page Component
- **File**: `resources/js/Pages/Error.tsx`
- **Features**:
  - Displays a modal with a technical issues message
  - Provides "Try Again" and "Go Home" buttons
  - Fallback content if modal fails to load
  - Automatic redirect to home after closing modal

### 3. Routes
- **Error Route**: `/error/{code}` - Displays custom error page
- **Test Route**: `/test-error` - Demonstrates error handling (remove in production)

## Configuration

### Enable Custom Error Handling
Set `APP_DEBUG=false` in your `.env` file:
```env
APP_DEBUG=false
```

### Disable Custom Error Handling
Set `APP_DEBUG=true` in your `.env` file to see Laravel's default error pages:
```env
APP_DEBUG=true
```

## Testing

1. **Set APP_DEBUG=false** in your `.env` file
2. Visit `/test-error` to see the custom error modal
3. Try accessing a non-existent route (404 error)
4. The modal will show: "We are currently experiencing some technical issues. It should be fixed soon."

## Features

- **User-Friendly**: No technical error details exposed to users
- **Consistent**: Same modal for all error types (404, 500, etc.)
- **Responsive**: Works on mobile and desktop
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Fallback**: Shows card layout if modal fails to load

## Customization

### Change Error Message
Edit the message in `app/Exceptions/Handler.php`:
```php
'message' => 'We are currently experiencing some technical issues. It should be fixed soon.',
```

### Modify Modal Design
Edit `resources/js/Pages/Error.tsx` to change:
- Modal appearance
- Button actions
- Redirect behavior
- Icons and styling

### Add Error Logging
In `app/Exceptions/Handler.php`, add logging in the `renderCustomErrorModal` method:
```php
Log::error('Error occurred', [
    'message' => $e->getMessage(),
    'file' => $e->getFile(),
    'line' => $e->getLine(),
    'trace' => $e->getTraceAsString()
]);
```

## Security Benefits

- **No Information Disclosure**: Users don't see sensitive error details
- **Consistent UX**: Professional appearance even during errors
- **Reduced Attack Surface**: Error details not exposed to potential attackers 