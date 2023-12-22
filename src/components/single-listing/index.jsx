import { useEffect, useState } from "react";
import { API_URL } from "../../lib/constants";
import { useParams } from "@tanstack/react-router";

const formatRemainingTime = (endsAt) => {
  const currentTime = new Date();
  const endTime = new Date(endsAt);
  const timeDifference = endTime - currentTime;

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  let formattedTime = "";
  if (days > 0) {
    formattedTime += `${days} days `;
  }
  if (hours > 0) {
    formattedTime += `${hours} hours `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes} minutes`;
  }

  return formattedTime.trim();
};

export default function ListingItem() {
  const [listing, setListing] = useState();
  const [error, setError] = useState(null);
  const { listingId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleBid = async () => {
    try {
      const apiUrl = `${API_URL}/listings/${listingId}/bids`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          amount: Number(bidAmount),
        }),
      };

      const bidResponse = await fetch(apiUrl, options);
      console.log(bidResponse, "bidResponse");

      if (!bidResponse.ok) {
        const errorData = await bidResponse.json();
        console.error("Error placing bid:", errorData);

        return;
      }
      const bidData = await bidResponse.json();

      console.log("Bid response:", bidData);

      closeModal();
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const url = new URL(`${API_URL}/listings/${listingId}`);
        url.searchParams.append("_seller", "true");
        url.searchParams.append("_bids", "true");

        const response = await fetch(url.href, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 400) {
          setError({ message: "Listing not found" });
        } else {
          const data = await response.json();

          const formattedListing = {
            ...data,
            endsAt: new Date(data.endsAt).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "numeric",
              minute: "numeric",
              hour12: false,
            }),
            created: new Date(data.created).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "numeric",
              minute: "numeric",
              hour12: false,
            }),
          };

          setListing(formattedListing);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>No listing found. {error?.message}</h1>;

  const latestBidAmount =
    listing?.bids?.length > 0
      ? Math.max(...listing.bids.map((bid) => bid.amount))
      : 0;
  const getRemainingTime = () => {
    return formatRemainingTime(listing?.endsAt);
  };

  return (
    <>
      <div className="container mx-auto flex items-center justify-center h-screen">
        <div className="w-full lg:w-2/5">
          <img
            src={listing?.media[0] || "https://source.unsplash.com/MP0IUfwrn0A"}
            className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
            alt="Profile"
          />
        </div>
        <div className="w-full  lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0">
          <div className="p-4 md:p-12 text-center lg:text-left">
            <div
              className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
              style={{
                backgroundImage: `url('${
                  listing?.media[0] || "https://source.unsplash.com/MP0IUfwrn0A"
                }')`,
              }}
            ></div>

            <h1 className="text-3xl font-bold pt-8 lg:pt-0 text-center uppercase">
              {listing?.title || "Unknown Title"}
            </h1>
            <div className="mx-auto lg:mx-0 pt-3 border-b-2 border-green-500 opacity-25"></div>
            <div className="flex flex-col items-center">
              <div className="avatar-container  flex rounded-full w-28 bg-blue-500 justify-center">
                {listing?.seller?.avatar && (
                  <img
                    src={listing.seller.avatar}
                    alt="Seller Avatar"
                    className="justify-center"
                  />
                )}
              </div>
              <p>Seller: {listing?.seller?.name || "Unknown Seller"}</p>

              {isModalOpen && (
                <div className="modal-container">
                  <dialog className="modal modal-middle sm:modal-middle" open>
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Place Bid</h3>
                      <label>
                        Bid Amount:
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={`Must be higher than ${latestBidAmount}`}
                          className="input w-full max-w-xs"
                        />
                      </label>

                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn" onClick={handleBid}>
                            Submit Bid
                          </button>
                          <button className="btn" onClick={closeModal}>
                            Close
                          </button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </div>
              )}
            </div>
            <div className="card p-4 border rounded-lg shadow-lg text-center">
              <p className="mb-4">{listing?.description}</p>
              <div className="flex flex-row">
                <p className="text-lg font-semibold mb-2">
                  Leading bid: $ {latestBidAmount}
                </p>
              </div>

              <button
                className="btn bg-text-500 text-text-900 py-2 px-4 rounded-full"
                onClick={openModal}
              >
                Place Bid
              </button>
              <p className="mt-4">Ends in {getRemainingTime()}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
