# Test User Setup

To test the sign-in functionality, you can either:

## Option 1: Create a test user via the signup page
1. Navigate to `/signup` in the frontend
2. Create a new user account
3. Use those credentials to test sign-in

## Option 2: Use an existing user (if any exist in the database)
Check if there are any existing users in the database by going to the users endpoint.

## Option 3: Create a test user via API call
You can create a test user by making a POST request to the `/api/Users` endpoint:

```json
POST http://localhost:5047/api/Users
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "phoneNumber": "+966501234567",
  "password": "TestPassword123",
  "confirmPassword": "TestPassword123"
}
```

## Testing the Sign-In Implementation

1. **Start the Backend**: 
   ```bash
   cd f1-store-backend/f1-store-api
   dotnet run
   ```

2. **Start the Frontend**:
   ```bash
   cd f1-store-frontend
   npm run dev
   ```

3. **Test the Sign-In Flow**:
   - Navigate to `/signin`
   - Enter valid credentials
   - Should redirect to home page
   - Username and profile photo should appear in navbar
   - Click on user menu to see dropdown with sign-out option

## Expected Behavior

✅ **Form Validation**: Email and password fields are required
✅ **Loading States**: Button shows "Signing In..." during API call
✅ **Error Handling**: Invalid credentials show error message
✅ **Success Flow**: Successful sign-in redirects to home and updates navbar
✅ **Authentication Persistence**: User stays logged in after page refresh
✅ **User Menu**: Shows profile photo, username, email, and sign-out option
✅ **Sign Out**: Clears user data and returns to sign-in/sign-up buttons
