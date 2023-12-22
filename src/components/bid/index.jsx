import { useState } from "react";
import { API_URL } from "../../lib/constants";

const BidButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [listingId, setListingId] = useState(""); // New state for listingId

  const openModal = (id) => {
    setListingId(id); // Set the listingId when opening the modal
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
          amount: bidAmount,
        }),
      };

      const bidResponse = await fetch(apiUrl, options);
      const bidData = await bidResponse.json();
      console.log("Bid placed successfully:", bidResponse);

      const currentCredits = parseInt(localStorage.getItem("credits")) || 0;
      const newCredits = currentCredits - bidAmount;
      localStorage.setItem("credits", newCredits);
      console.log("Current Credits:", currentCredits);
      console.log("Bid Amount:", bidAmount);
      console.log("New Credits:", newCredits);
      console.log("Bid response:", bidData);

      // Close the modal after a successful bid
      closeModal();
    } catch (error) {
      closeModal();
      console.error("Error placing bid:", error);
    } finally {
      window.location.reload(true);
    }
  };
  const hasAccessToken = !!localStorage.getItem("access_token");

  return (
    <div>
      {hasAccessToken && (
        <button onClick={() => openModal(listingId)}>Place Bid</button>
      )}
      {isModalOpen && (
        <div className="modal-container">
          <dialog className="modal modal-bottom sm:modal-middle" open>
            <div className="modal-box">
              <h3 className="font-bold text-lg">Place Bid</h3>
              <label>
                Bid Amount:
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </label>
              <button onClick={handleBid}>Submit Bid</button>

              <div className="modal-action">
                <form method="dialog">
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
  );
};

export default BidButton;
