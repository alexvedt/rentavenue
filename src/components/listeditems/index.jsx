import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { API_URL } from "../../lib/constants";

export default function FetchListings() {
  const [loading, setIsLoading] = useState(true);
  const [listings, setListing] = useState([]);
  const [searchInput, handleOnSearch] = useState("");
  const [error, setError] = useState(null);

  const handleSearchInputChange = (event) => {
    handleOnSearch(event.target.value);
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("access_token");
        const url = new URL(
          `${API_URL}/listings?&_active=true&sort=created&order=desc`
        );

        url.searchParams.append("_seller", "true");
        url.searchParams.append("_bids", "true");
        console.log(url, "url");
        const listingResponse = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const listings = await listingResponse.json();
        console.log(listings, "listings");
        console.log(listings);

        const formattedListings = listings.map((listing) => {
          return {
            ...listing,
            endsAt: new Date(listing.endsAt).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "numeric",
              minute: "numeric",
              hour12: false,
            }),
          };
        });

        const sortedListings = formattedListings.sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        );

        const filteredListings = sortedListings.filter((listing) => {
          return listing.title
            .toLowerCase()
            .includes(searchInput.toLowerCase());
        });

        setListing(filteredListings);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [searchInput]);

  return (
    <div>
      <div className="search-bar-container mt-4 mb-8">
        <input
          type="text"
          placeholder="Search by title"
          value={searchInput}
          onChange={handleSearchInputChange}
          className="p-2 border border-solid rounded-md w-64 md:w-96"
        />
      </div>

      {loading && (
        <>
          <div className="skeleton listing-container">
            <div className="flex flex-col gap-4 w-52">
              <div className="skeleton h-4 w-full"></div>
            </div>
          </div>
        </>
      )}
      {error && <p>Error: {error.message}</p>}

      <div className="listing-container flex flex-wrap gap-8 justify-center">
        {listings.map(
          ({ id, title, media, description, endsAt, seller, tags }) => (
            <div
              key={id}
              className="listing-item w-72 text-center md:w-1/4 border-solid rounded-lg card-bordered"
            >
              {media && (
                <img
                  src={media}
                  className="object-cover w-full h-40"
                  alt={title}
                  onError={(e) => {
                    e.target.src =
                      "https://source.unsplash.com/300x200/?placeholder";
                  }}
                />
              )}
              <h2>{title}</h2>
              <div>
                <p>{description}</p>
              </div>
              <p>Deadline: {endsAt}</p>
              <p>Seller: {seller.name} </p>
              <p>Tags: {tags}</p>
              <div>
                <Link to={`/listingitem/${id}?id=${id}`}>
                  <button className="rounded-xl bg-cta-color py-1 px-2 font-semibold my-2">
                    View Listing
                  </button>
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
