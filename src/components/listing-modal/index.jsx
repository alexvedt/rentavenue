import PropTypes from "prop-types";
import CreateListing from "../creating-listing";

const ListingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
        <CreateListing onClose={onClose} />
      </div>
    </div>
  );
};

ListingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ListingModal;
