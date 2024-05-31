export const API_URL =
  import.meta.env.VITE_API_URL || "https://v2.api.noroff.dev/holidaze";
export const NAVIGATION = [
  { label: "Home", href: "/" },
  { label: "Profile", href: "/profile" },
  { label: "Register", href: "/register" },
  { label: "Login", href: "/login" },
  { label: "Listing", href: "/listing" },
  { label: "ManageVenues", href: "/manage-venues" },
];

//* Auth / create API key:

//* Specific venue:

export async function fetchVenueById(venueId) {
  const url = new URL(`${API_URL}/${venueId}`);
  url.searchParams.append("_owner", "true");
  url.searchParams.append("_bookings", "true");

  try {
    const response = await fetch(url.href);
    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
