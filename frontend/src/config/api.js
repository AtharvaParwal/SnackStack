// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

console.log("API_BASE_URL:", API_BASE_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/user/login`,
  BUYER_LOGIN: `${API_BASE_URL}/user/Buyerlogin`,
  LOGOUT: `${API_BASE_URL}/user/logout`,
  PROFILE: `${API_BASE_URL}/user/profile`,
  VERIFY_TOKEN: `${API_BASE_URL}/user/verify`,
  
  // User endpoints
  BUYER_REGISTER: `${API_BASE_URL}/user/Buyerregister`,
  VENDOR_REGISTER: `${API_BASE_URL}/user/Vendorregister`,
  FIND_BUYER: `${API_BASE_URL}/user/findbuyer`,
  FIND_VENDOR: `${API_BASE_URL}/user/findvendor`,
  UPDATE_BUYER: `${API_BASE_URL}/user/updatebuyer`,
  UPDATE_VENDOR: `${API_BASE_URL}/user/updatevendor`,
  
  // Food endpoints
  FOOD_ITEMS: `${API_BASE_URL}/food/fooditems`,
  ADD_FOOD_ITEM: `${API_BASE_URL}/food/addfooditems`,
  UPDATE_FOOD_ITEM: `${API_BASE_URL}/food/updatefooditem`,
  DELETE_FOOD_ITEM: `${API_BASE_URL}/food/deletefooditem`,
  UPDATE_FOOD_RATING: `${API_BASE_URL}/food/updaterating`,
  
  // Cart endpoints
  CART_ITEMS: `${API_BASE_URL}/cart/getitems`,
  ADD_TO_CART: `${API_BASE_URL}/cart/additem`,
  
  // Order endpoints
  PLACE_ORDER: `${API_BASE_URL}/order/placeorder`,
  GET_ORDERS: `${API_BASE_URL}/order/getorderbyemail`,
  MY_ORDERS: `${API_BASE_URL}/order/myorders`,
  VENDOR_ORDERS: `${API_BASE_URL}/order/vendororders`,
  UPDATE_ORDER_STATUS: `${API_BASE_URL}/order/updatestatus`,
  MARK_ORDER_RATED: `${API_BASE_URL}/order/rated`,
  
  // Wallet endpoints
  GET_BALANCE: `${API_BASE_URL}/wallet/getbalance`,
  ADD_BALANCE: `${API_BASE_URL}/wallet/addbalance`,
  
  // Test endpoint
  TEST_API: `${API_BASE_URL}/testAPI`,
  HEALTH_CHECK: `${API_BASE_URL}/testAPI/health`,
  
  // Base URL for direct use
  API_BASE_URL: API_BASE_URL
};

console.log("BUYER_REGISTER endpoint:", API_ENDPOINTS.BUYER_REGISTER);

export default API_BASE_URL;
