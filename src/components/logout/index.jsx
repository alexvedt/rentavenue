export const handleLogout = () => {
  console.log("Logging out");
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_name");
};

export default handleLogout;
