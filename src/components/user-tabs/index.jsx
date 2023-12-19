import { useState, useEffect } from "react";
import { API_URL } from "../../lib/constants";
import { Link } from "@tanstack/react-router";

const UserProfileDetails = () => {
  const userId = localStorage.getItem("user_name");
  const [userListings, setUserListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        // Use the user name stored in localStorage
        const userName = localStorage.getItem("user_name");

        if (!userName) {
          console.error("User name not found");
          return;
        }

        const url = new URL(`${API_URL}/profiles/${userName}/listings`);
        url.searchParams.append("_bids", "true");
        url.searchParams.append("_seller", "true");
        url.searchParams.append("active", "false");
        let limit = 30;

        url.searchParams.append("limit", `${limit}`);
        const response = await fetch(url.href, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const listingsData = await response.json();
          console.log("Listings:", listingsData);
          setUserListings(listingsData);
        } else {
          console.error("Error fetching listings");
        }
      } catch (error) {
        console.error("Error fetching user listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserListings();
    }
  }, [userId]);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div role="tablist" className="tabs tabs-lifted">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Listings"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <div className="flex flex-wrap gap-8 justify-center">
          {userListings.map((listing) => (
            <div
              key={listing.id}
              className="listing-item w-72 text-center md:w-1/4 border-solid rounded-lg card-bordered p-4"
            >
              {listing.media && (
                <img
                  src={listing.media[0]}
                  className="object-cover w-full h-40 rounded-t-lg"
                  alt={listing.title}
                  onError={(e) => {
                    e.target.src =
                      "https://source.unsplash.com/300x200/?placeholder";
                  }}
                />
              )}
              <div className="mt-2">
                <h2 className="text-lg font-semibold">{listing.title}</h2>
                <p className="text-sm">{listing.description}</p>
                <p className="text-sm">Deadline: {listing.endsAt}</p>
                <p className="text-sm">Seller: {listing.seller.name}</p>
                <p className="text-sm">Tags: {listing.tags.join(", ")}</p>
              </div>
              <Link to={`/listingitem/${listing.id}?id=${listing.id}`}>
                <button className="rounded-xl bg-cta-color py-1 px-2 font-semibold my-2">
                  View Listing
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Bids"
        checked
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        Coming soon....
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Owned"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        Coming soon....
      </div>
    </div>
  );
};

export default UserProfileDetails;
