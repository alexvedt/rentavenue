import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { API_URL } from "../../lib/constants";

export default function FetchVenues() {
  const [loading, setIsLoading] = useState(true);
  const [venues, setVenues] = useState([]);
  const [searchInput, handleOnSearch] = useState("");
  const [error, setError] = useState(null);

  const handleSearchInputChange = (event) => {
    handleOnSearch(event.target.value);
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem("access_token");
        const url = new URL(
          `${API_URL}/venues?&_active=true&sort=created&order=desc`
        );

        const venueResponse = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await venueResponse.json();
        if (!venueResponse.ok) {
          throw new Error("Failed to fetch venues");
        }

        const formattedVenues = Array.isArray(result.data) ? result.data : [];
        const filteredVenues = formattedVenues.filter((venue) => {
          const searchString = searchInput.toLowerCase();
          const nameMatch = venue.name.toLowerCase().includes(searchString);
          const locationMatch =
            venue.location &&
            (venue.location.address?.toLowerCase().includes(searchString) ||
              venue.location.city?.toLowerCase().includes(searchString) ||
              venue.location.country?.toLowerCase().includes(searchString));
          return nameMatch || locationMatch;
        });

        setVenues(filteredVenues);
      } catch (error) {
        console.error("An error occurred:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, [searchInput]);

  return (
    <section role="listings" className="p-8 bg-white">
      <div className="search-bar-container mt-4 mb-8">
        <input
          type="text"
          placeholder="Search by name"
          value={searchInput}
          onChange={handleSearchInputChange}
          className="p-2 border border-solid border-text-100 rounded-md w-64 md:w-96"
        />
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <div className="parent-hero-banner bg-nav-color w-full max-h-60 pb-2 flex justify-between">
        <h1>Latest listings</h1>{" "}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {venues.length > 0 ? (
          venues.map(({ id, name, media, price, location, maxGuests }) => (
            <motion.div
              key={id}
              whileHover="hover"
              className="w-full h-[300px] relative"
            >
              <div className="h-1/2 p-6 flex flex-col justify-center bg-black">
                <h3 className="text-xl mb-2 font-semibold text-white">
                  {name}
                </h3>
                <p className="text-sm font-light text-slate-300">
                  ${price} per night
                </p>
                <p className="text-sm font-light text-slate-300">
                  Location: {location.city}
                </p>
                <p className="text-sm font-light text-slate-300">
                  Max guests: {maxGuests}
                </p>
              </div>
              <motion.div
                initial={{
                  top: "0%",
                  right: "0%",
                }}
                variants={{
                  hover: {
                    top: "50%",
                    right: "50%",
                  },
                }}
                className="absolute inset-0 bg-slate-200 z-10"
                style={{
                  backgroundImage: `url(${
                    media && media.length > 0
                      ? media[0].url
                      : "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <Link to={`/singlevenue/?&venueId=${id}`}>
                <motion.a
                  rel="nofollow"
                  className="w-1/2 h-1/2 absolute bottom-0 right-0 z-0 grid place-content-center bg-white text-black hover:text-indigo-500 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-xs">MORE</span>
                    <FiArrowUpRight className="text-lg" />
                  </div>
                </motion.a>
              </Link>
            </motion.div>
          ))
        ) : (
          <p>No venues found</p>
        )}
      </div>
    </section>
  );
}

const CreateAPIKey = async () => {
  const accessToken = localStorage.getItem("access_token");
  const url = "https://v2.api.noroff.dev/auth/create-api-key";
  const options = {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      name: localStorage.getItem("name"),
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Failed to create API key");
    }
    const apiKeyData = await response.json();
    const apiKey = apiKeyData.data.key;
    localStorage.setItem("apiKey", apiKey);
  } catch (error) {
    console.error("Error creating API key:", error);
    return null;
  }
};

CreateAPIKey();
