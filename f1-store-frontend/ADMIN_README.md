# Admin Panel - F1 Store

## Overview
The admin panel provides a comprehensive dashboard for managing the F1 store operations. It's accessible only to authenticated users through the user dropdown menu in the navbar.

## Features

### Dashboard
- **Statistics Overview**: Display key metrics including total products, orders, revenue, and active users
- **Recent Activity**: Show latest store activities like new products, orders, and user registrations
- **Real-time Updates**: Statistics update automatically (mock data for now)

### Product Management
- **Product List**: View all products with images, names, categories, teams, prices, and status
- **Product Actions**: Edit and delete existing products
- **Add Products**: Button to add new products (functionality to be implemented)

### Order Management
- **Order List**: View all orders with customer details, products, totals, and status
- **Order Filtering**: Filter orders by status (All, Pending, Processing, Shipped, Delivered)
- **Order Actions**: View order details and update order status

### User Management
- **User List**: View all registered users with avatars, usernames, emails, and join dates
- **User Actions**: Edit user information and suspend accounts
- **Add Users**: Button to add new users (functionality to be implemented)

### Additional Sections
- **Teams Management**: Manage F1 teams (coming soon)
- **Drivers Management**: Manage F1 drivers (coming soon)
- **Analytics**: Detailed store analytics (coming soon)
- **Settings**: Store configuration (coming soon)

## Access
1. Sign in to your account
2. Click on your profile picture/username in the navbar
3. Select "Admin Panel" from the dropdown menu
4. You'll be redirected to `/admin`

## Technical Details

### Components
- **Admin.tsx**: Main admin page component with tabbed navigation
- **Admin.css**: Comprehensive styling with responsive design

### Routing
- Route: `/admin`
- Protected: Yes (requires authentication)
- Component: `<Admin />`

### State Management
- Uses React hooks for local state management
- Tab-based navigation between different admin sections
- Responsive design that adapts to different screen sizes

### Styling
- Modern gradient design with F1 theme
- Responsive grid layouts
- Interactive hover effects and transitions
- Mobile-first responsive design

## Future Enhancements
- [ ] Real-time data integration with backend
- [ ] User role-based access control
- [ ] Advanced filtering and search
- [ ] Bulk operations for products and orders
- [ ] Export functionality for reports
- [ ] Real-time notifications
- [ ] Advanced analytics and charts
- [ ] Inventory management
- [ ] Customer support tools

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (responsive design)

## Notes
- Currently uses mock data for demonstration
- All CRUD operations are placeholders
- Designed to be easily extensible for future features
- Follows modern React best practices
