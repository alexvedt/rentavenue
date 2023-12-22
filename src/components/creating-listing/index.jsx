import { useState } from "react";
import { API_URL } from "../../lib/constants";

const CreateListingModal = () => {
  const date = new Date();
  const [formData, setFormData] = useState({
    title: "",
    endsAt: date.toISOString().split("T")[0],
    media: [], // Change to an array to handle multiple files
    description: "",
  });

  const [isListingCreated, setListingCreated] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "endsAt" ? formatDateString(value) : value,
    }));

    // Handle multiple media files
    if (name.startsWith("media")) {
      const index = parseInt(name.replace("media", ""), 10);
      setFormData((prevFormData) => {
        const updatedMedia = [...prevFormData.media];
        updatedMedia[index] = value;
        return { ...prevFormData, media: updatedMedia };
      });
    }
  };

  const formatDateString = (dateString) => {
    const selectedDate = new Date(dateString);
    const formattedDate = selectedDate.toISOString().split("T")[0];
    return formattedDate;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(`${API_URL}/listings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          endsAt: formData.endsAt,
          media: formData.media,
          description: formData.description,
        }),
      });

      if (response.ok) {
        console.log("Listing created successfully!");
        setListingCreated(true);
        console.log(formData);
      } else {
        const responseBody = await response.json();
        console.error(
          "Failed to create listing. Server returned:",
          response.status,
          response.statusText,
          responseBody
        );
      }
    } catch (error) {
      console.error("An error occurred during form submission:", error);
    } finally {
      setIsLoading(false);
      closeModal();
      window.location.reload(true);
    }
  };

  const hasAccessToken = !!localStorage.getItem("access_token");

  return (
    <div>
      {hasAccessToken && (
        <button className="btn" onClick={openModal}>
          Create Listing
        </button>
      )}
      {isModalOpen && (
        <div className="modal-container">
          <dialog className="modal modal-middle sm:modal-middle" open>
            <div className="modal-box">
              <h3 className="font-bold text-lg">Create Listing</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="deadline"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Duration
                  </label>
                  <input
                    type="date"
                    name="endsAt"
                    value={formData.endsAt}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md"
                    required
                  />
                </div>
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="mb-4">
                    <label
                      htmlFor={`media${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Media File {index + 1}
                    </label>
                    <input
                      type="text"
                      id={`media${index}`}
                      name={`media${index}`}
                      value={formData.media[index] || ""}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>
                ))}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="modal-action">
                  <button
                    type="submit"
                    className={`btn text-my-black rounded-lg p-2 font-semibold transition ${
                      isListingCreated ? "bg-success-green" : ""
                    }`}
                    disabled={loading}
                  >
                    {isListingCreated ? "Listing Created" : "Create Listing"}
                  </button>{" "}
                  <button className="btn" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
};

export default CreateListingModal;
