// Modal.jsx

import { useEffect, useState } from "react";
import "./modal.css";

const Modal = () => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");

    if (isInitialRender && !storedToken) {
      setIsModalVisible(true);
    }

    setIsInitialRender(false);
  }, [isInitialRender]);

  if (!isModalVisible) {
    return null;
  }

  return (
    <div className="modal-container">
      <dialog className="modal modal-bottom sm:modal-middle" open>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Welcome!</h3>
          <p className="py-4">You are not logged in.</p>
          <p>
            Don´t worry, you´ll still be able to browse venues. But if you want
            to do more, you´ll have to log in first.
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
