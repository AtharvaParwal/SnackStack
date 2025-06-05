# SnackStack 🍔
A full-featured **MERN Stack Canteen Portal** for real-time food ordering, wallet-based payments, vendor management, and analytics — all in one platform.

---

## 🔧 Features

### 🔐 Authentication & Roles
- Secure registration & login for **Buyers** and **Vendors**
- Separate dashboards and permissions for each role

### 🛒 Buyer Functionalities
- Search and filter food items by name, price range, and Veg/Non-Veg
- **Fuzzy Search** for flexible item discovery (Bonus)
- Prevents ordering from vendors that are closed at the current time
- Place orders with:
  - Quantity
  - Add-ons (if any)
  - Wallet balance deduction
- Order only allowed if wallet balance ≥ total cost
- Add money to wallet on a dedicated wallet page
- Track order status through stages:
  - Placed → Accepted → Cooking → Ready → Picked
- Rate completed orders (1 to 5 stars), affecting the item’s average rating
- Email notification on order **acceptance or rejection** (Bonus)

### 🍳 Vendor Functionalities
- Add, edit, and delete food items
- View, accept, or reject incoming orders
- Move orders through status pipeline
- Restriction: **Max 10 active (Accepted + Cooking) orders** at a time
- Dashboard analytics (Bonus):
  - Top 5 most ordered items
  - Order count stats (Placed, Pending, Completed)
  - Visual charts (e.g., Pie or Bar)

---

## 🛠️ Tech Stack

| Frontend     | Backend      | Database   | Tools Used                    |
|--------------|--------------|------------|-------------------------------|
| React.js     | Node.js      | MongoDB    | Express, Mongoose, JWT, bcrypt |
| React Router | Express.js   | Mongo Atlas | Chart.js, Fuse.js (Fuzzy Search), Nodemailer |

---
