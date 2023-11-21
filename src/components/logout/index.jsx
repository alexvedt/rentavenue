export const handleLogout = () => {
  console.log("Logging out");
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_name");
  console.log("Logged out");
};

export default handleLogout;
