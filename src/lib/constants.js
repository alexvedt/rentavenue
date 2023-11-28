/**
 * The API URL is set in the .env file. Use this everywhere you need to make an API call.
 * @example const response = await fetch(`${API_URL}/social/posts`);
 * @link https://docs.noroff.dev/social-endpoints/posts
 */
export const API_URL =
  import.meta.env.VITE_API_URL || "https://api.noroff.dev/api/v1/auction";

export const NAVIGATION = [
  { label: "Home", href: "/" },
  { label: "Profile", href: "/profile" },
  { label: "Register", href: "/register" },
  { label: "Login", href: "/login" },
  { label: "Listing", href: "/listing" },
];
