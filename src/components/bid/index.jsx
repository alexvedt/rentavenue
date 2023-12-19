import { useState } from "react";
import { API_URL } from "../../lib/constants";

const BidButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [listingId, setListingId] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isSuccessfulBid, setIsSuccessfulBid] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const openModal = (id) => {
    setListingId(id);
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

      // Place bid using fetch
      const bidResponse = await fetch(apiUrl, options);
      console.log(bidResponse);
      const currentCredits = parseInt(localStorage.getItem("credits")) || 0;
      const newCredits = currentCredits - bidAmount;
      localStorage.setItem("credits", newCredits);

      setShowToast(true);
      setIsSuccessfulBid(true);
      setToastMessage("Bid successfully placed!");
      closeModal();
    } catch (error) {
      console.error("Error placing bid:", error);
      setIsSuccessfulBid(false);
      setToastMessage("Bid error. Please try again.");
    } finally {
      setTimeout(() => {
        setShowToast(true);
      }, 3000);
    }
  };

  return (
    <div>
      <button onClick={() => openModal(listingId)}>Place Bid</button>

      {/* Modal for placing bid */}
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

      {showToast && (
        <div
          className={`toast-top toast-end ${
            isSuccessfulBid ? "alert-info" : "alert-error"
          }`}
        >
          <div className="alert">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidButton;
