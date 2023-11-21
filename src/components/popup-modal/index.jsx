// Modal.jsx

import { useEffect, useState } from "react";
import "./Modal.css"; // Import the CSS file for styling

const Modal = () => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");

    // If it's the initial render and the access token is not found, show the modal
    if (isInitialRender && !storedToken) {
      setIsModalVisible(true);
    }

    // Update the state to indicate that the initial render is complete
    setIsInitialRender(false);
  }, [isInitialRender]);

  if (!isModalVisible) {
    return null; // If access_token is found or the initial render is complete, don't render the modal
  }

  return (
    <div className="modal-container">
      {/* Other modal content */}
      <dialog className="modal modal-bottom sm:modal-middle" open>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            It looks like you are not logged into your account.
          </p>
          <p>
            Don´t worry, you´ll still be able to browse listings. But if you
            want to do more, you´ll have to log in first.
          </p>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => setIsModalVisible(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
