export const handleLogout = () => {
  console.log("Logging out");
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_name");
  localStorage.removeItem("credits");
  localStorage.removeItem("avatar");
  localStorage.removeItem("email");
};

export default handleLogout;
