// ========================
// Authentication Utilities
// ========================

// Save user data after login
export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Check user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

// Check if user is admin
export const isAdmin = () => {
  return getUserRole() === 'ADMIN';
};

// Check if user is faculty
export const isFaculty = () => {
  return getUserRole() === 'FACULTY';
};

// Check if user is student
export const isStudent = () => {
  return getUserRole() === 'STUDENT';
};