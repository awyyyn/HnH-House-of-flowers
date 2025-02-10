# House of Flowers Web Application

### Overview

This web application is designed for **House of Flowers**, a floral shop. The purpose of the application is to streamline processes related to managing inventory, enhancing customer accessibility to floral products, and providing a platform for communication and order tracking.

### Key Features

- **Product Catalog**: Allows customers to browse through a catalog of floral products with detailed descriptions and prices.
- **Order Management**: Admins can track and manage customer orders, including processing payments and updating order statuses.
- **Notifications**: Sends notifications to customers about order updates, promotions, or announcements.
- **Customer Reviews**: Customers can leave reviews and ratings for products they have purchased.

### Technologies Used

- **Programming Language**: TypeScript
- **Frontend**: ReactJS
- **Backend**: Node.js, Express.js, and GraphQL
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) or another method for secure login
- **Hosting/Deployment**: Vercel and Render

### Get Started

To get this application up and running locally on your machine:

1. Clone the repository:

   ```
   git clone git@github.com:awyyyn/hnh-house-of-flowers.git
   ```

2. Run server locally:

   ```JavaScript
    //  1.  Navigate to server
         cd server

    // 2. Install Dependencies
         npm install

    // 3. Generate Prisma
         npx prisma generate

    // 4. Environmental Variable
         //     - Create .env file in the server folder
         //     - Input the Env Variables (if you don't know ask for the main developer)
         DATABASE_URL=""
         PORT=
         SALT=
         EMAIL=""
         PASSWORD=""
         ACCESS_SECRET=""
         REFRESH_SECRET=""
         CLIENT_URL=""

    // 5. Run server
         npm  run dev
   ```

3. Run client application locally

   ```JavaScript
    // 1. Open new terminal

    // 2. Navigate to client folder

    // 3. Environmental Variable
         //     - Create .env file in the server folder
         //     - Input the Env Variables (if you don't know ask for the main developer)
         VITE_GQL_API_URL=""
         VITE_API_URL=""

    // 4. Install dependencies
           npm install

    // 5. Run application
         npm run dev
   ```

## Usage

- **For Customers**:

  - Browse the product catalog and add items to your cart.
  - Proceed to checkout and place your order.
  - Track your order status and receive notifications about updates.

- **For Admins**:
  - Use the admin login to manage inventory, orders, and customer interactions.
  - You can update product details, process orders, and communicate with customers.

## Copyright

© 2025 House of Flowers. All rights reserved. This repository is private and intended for authorized personnel only.
