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
