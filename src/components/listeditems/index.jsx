import { useState, useEffect } from "react";
import { API_URL } from "../../lib/constants";

const UserProfileDetails = () => {
  const userId = localStorage.getItem("user_name");
  const [userListings, setUserListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const url = new URL(`${API_URL}/listings`);
        url.searchParams.append("_bids", "true");
        url.searchParams.append("_seller", "true");
        url.searchParams.append("active", "false");
        let listLimit = 30;

        url.searchParams.append("limit", `${listLimit}`);
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
    <div className="flex flex-wrap gap-8 justify-center">
      {/* User Listings */}
      {userListings.map((listing) => (
        <div
          key={listing.id}
          className="listing-item w-72 text-center md:w-1/4 border-solid rounded-lg card-bordered"
        >
          {/* Your existing code for media */}
          {listing.media && (
            <img
              src={listing.media}
              className="object-cover w-full h-40"
              alt={listing.title}
              onError={(e) => {
                e.target.src =
                  "https://source.unsplash.com/300x200/?placeholder";
              }}
            />
          )}

          {/* Your existing code for title, description, endsAt, seller, tags */}
          <h2>{listing.title}</h2>
          <div>
            <p>{listing.description}</p>
          </div>
          <p>Deadline: {listing.endsAt}</p>
          <p>Seller: {listing.seller.name} </p>
          <p>Tags: {listing.tags}</p>
        </div>
      ))}
    </div>
  );
};

export default UserProfileDetails;
