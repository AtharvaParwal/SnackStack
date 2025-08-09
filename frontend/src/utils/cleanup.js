// Utility to clean up localStorage for better user experience
const cleanupUserData = () => {
  const items = ['user', 'userEmail', 'userName', 'userType', 'status'];
  items.forEach(item => localStorage.removeItem(item));
  console.log('User data cleaned up');
};

// Add this to window for easy testing
window.cleanupUserData = cleanupUserData;

export default cleanupUserData;
