import { useState, useEffect } from "react";
import { API_URL } from "../../lib/constants";
import SpringModal from "../SpringModal"; // Ensure the path is correct

const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentVenue, setCurrentVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    media: [{ url: "", alt: "" }],
    price: 0,
    maxGuests: 0,
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("access_token");
        const userName = localStorage.getItem("user_name");

        const response = await fetch(`${API_URL}/profiles/${userName}/venues`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": localStorage.getItem("apiKey"),
          },
        });

        const data = await response.json();
        setVenues(data.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      const method = currentVenue ? "PUT" : "POST";
      const url = `${API_URL}/venues${
        currentVenue ? `/${currentVenue.id}` : ""
      }`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": localStorage.getItem("apiKey"),
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          maxGuests: Number(formData.maxGuests),
          media: formData.media.map((m) => ({
            ...m,
            url: new URL(m.url).toString(),
          })),
        }),
      });

      if (response.ok) {
        const updatedVenue = await response.json();
        setVenues((prevVenues) =>
          currentVenue
            ? prevVenues.map((venue) =>
                venue.id === currentVenue.id ? updatedVenue.data : venue
              )
            : [...prevVenues, updatedVenue.data]
        );
        closeModal();
      } else {
        const errorData = await response.json();
        console.error("Failed to create/update venue", errorData);
        setError(new Error("Failed to create/update venue"));
      }
    } catch (error) {
      console.error("An error occurred during form submission:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/venues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": localStorage.getItem("apiKey"),
        },
      });

      if (response.ok) {
        setVenues((prevVenues) =>
          prevVenues.filter((venue) => venue.id !== id)
        );
        closeModal();
      } else {
        console.error("Failed to delete venue");
        setError(new Error("Failed to delete venue"));
      }
    } catch (error) {
      console.error("An error occurred during deletion:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      name: "",
      description: "",
      media: [{ url: "", alt: "" }],
      price: 0,
      maxGuests: 0,
      rating: 0,
      meta: {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false,
      },
      location: {
        address: "",
        city: "",
        zip: "",
        country: "",
        continent: "",
        lat: 0,
        lng: 0,
      },
    });
    setCurrentVenue(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (venue) => {
    setFormData(venue);
    setCurrentVenue(venue);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (venue) => {
    setCurrentVenue(venue);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentVenue(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Venues</h1>
      <button
        className="btn bg-blue-500 text-white mb-4"
        onClick={openCreateModal}
      >
        Create New Venue
      </button>

      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}

      {venues.length === 0 && !isLoading && !error && <p>No venues found.</p>}

      {venues.map((venue) => (
        <div key={venue.id} className="flex mb-4 p-4 border rounded-lg shadow">
          <img
            src={
              venue.media[0]?.url ||
              `https://source.unsplash.com/random/150x150?sig=${venue.id}`
            }
            alt="Venue"
            className="w-32 h-32 object-cover rounded-lg"
          />
          <div className="flex-grow ml-4">
            <p>
              <strong>Venue ID:</strong> {venue.id}
            </p>
            <p>
              <strong>Name:</strong> {venue.name}
            </p>
            <p>
              <strong>Description:</strong> {venue.description}
            </p>
            <p>
              <strong>Price:</strong> ${venue.price}
            </p>
            <p>
              <strong>Max Guests:</strong> {venue.maxGuests}
            </p>
            <button
              onClick={() => openEditModal(venue)}
              className="btn bg-yellow-500 text-white mb-2"
            >
              Edit
            </button>
            <button
              onClick={() => openDeleteModal(venue)}
              className="btn bg-red-500 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <SpringModal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={closeModal}
      >
        <h2 className="text-2xl font-bold mb-4">
          {currentVenue ? "Edit Venue" : "Create Venue"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
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
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="media"
              className="block text-sm font-medium text-gray-700"
            >
              Media URL
            </label>
            <input
              type="url"
              id="media"
              name="media"
              value={formData.media[0]?.url}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  media: [{ url: e.target.value, alt: "" }],
                }))
              }
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="maxGuests"
              className="block text-sm font-medium text-gray-700"
            >
              Max Guests
            </label>
            <input
              type="number"
              id="maxGuests"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="wifi"
              className="block text-sm font-medium text-gray-700"
            >
              WiFi
            </label>
            <input
              type="checkbox"
              id="wifi"
              name="meta.wifi"
              checked={formData.meta.wifi}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  meta: { ...prevFormData.meta, wifi: e.target.checked },
                }))
              }
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="parking"
              className="block text-sm font-medium text-gray-700"
            >
              Parking
            </label>
            <input
              type="checkbox"
              id="parking"
              name="meta.parking"
              checked={formData.meta.parking}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  meta: { ...prevFormData.meta, parking: e.target.checked },
                }))
              }
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="breakfast"
              className="block text-sm font-medium text-gray-700"
            >
              Breakfast
            </label>
            <input
              type="checkbox"
              id="breakfast"
              name="meta.breakfast"
              checked={formData.meta.breakfast}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  meta: { ...prevFormData.meta, breakfast: e.target.checked },
                }))
              }
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="pets"
              className="block text-sm font-medium text-gray-700"
            >
              Pets
            </label>
            <input
              type="checkbox"
              id="pets"
              name="meta.pets"
              checked={formData.meta.pets}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  meta: { ...prevFormData.meta, pets: e.target.checked },
                }))
              }
              className="mt-1"
            />
          </div>
          <button
            type="submit"
            className="btn bg-blue-500 text-white rounded-lg p-2 font-semibold transition"
            disabled={isLoading}
          >
            {currentVenue ? "Update Venue" : "Create Venue"}
          </button>
        </form>
      </SpringModal>

      <SpringModal isOpen={isDeleteModalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-bold mb-4">Are you sure?</h2>
        <p>
          Do you really want to delete the venue with ID {currentVenue?.id}?
        </p>
        <button
          onClick={() => handleDelete(currentVenue.id)}
          className="btn bg-red-500 text-white mr-2"
        >
          Yes
        </button>
        <button onClick={closeModal} className="btn bg-gray-500 text-white">
          No
        </button>
      </SpringModal>
    </div>
  );
};

export default ManageVenues;
