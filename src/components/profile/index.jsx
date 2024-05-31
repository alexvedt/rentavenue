import { useState, useEffect } from "react";
import { API_URL } from "../../lib/constants";
import Modal from "../SpringModal"; // Import the SpringModal component

const Profile = () => {
  const userId = localStorage.getItem("user_name");
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    dateFrom: "",
    dateTo: "",
    guests: 1,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/profiles/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "X-Noroff-API-Key": localStorage.getItem("apiKey"),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const userData = await response.json();
        setUser(userData.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/profiles/${userId}/bookings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "X-Noroff-API-Key": localStorage.getItem("apiKey"),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const bookingsData = await response.json();
        setBookings(bookingsData.data);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
      fetchUserBookings();
    }
  }, [userId]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewImageUrl("");
  };

  const handleImageChange = async () => {
    if (!newImageUrl.trim()) {
      setError({ message: "Image URL cannot be empty." });
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(`${API_URL}/profiles/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": localStorage.getItem("apiKey"),
        },
        body: JSON.stringify({ avatar: { url: newImageUrl } }),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const updatedUser = await response.json();
      setUser(updatedUser.data);
      closeModal();
    } catch (error) {
      console.error("Error updating profile image:", error);
      setError(error);
    }
  };

  const openUpdateModal = (booking) => {
    setCurrentBooking(booking);
    setUpdateFormData({
      dateFrom: booking.dateFrom,
      dateTo: booking.dateTo,
      guests: booking.guests,
    });
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentBooking(null);
  };

  const openDeleteModal = (booking) => {
    setCurrentBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentBooking(null);
  };

  const handleUpdateBooking = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(`${API_URL}/bookings/${currentBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": localStorage.getItem("apiKey"),
        },
        body: JSON.stringify(updateFormData),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const updatedBooking = await response.json();
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === currentBooking.id ? updatedBooking.data : booking
        )
      );
      closeUpdateModal();
    } catch (error) {
      console.error("Error updating booking:", error);
      setError(error);
    }
  };

  const handleDeleteBooking = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(`${API_URL}/bookings/${currentBooking.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": localStorage.getItem("apiKey"),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== currentBooking.id)
      );
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting booking:", error);
      setError(error);
    }
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error.message}</h1>;

  return (
    <>
      <div className="container mx-auto flex items-center justify-center h-screen">
        <div className="w-full lg:w-4/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0">
          <div className="p-4 md:p-12 text-center lg:text-left">
            <div
              className="relative block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
              style={{
                backgroundImage: `url('${
                  user?.avatar?.url || "https://source.unsplash.com/MP0IUfwrn0A"
                }')`,
              }}
            >
              <button
                onClick={openModal}
                className="absolute bottom-0 right-0 p-2 bg-indigo-500 text-white rounded-full"
              >
                Change
              </button>
            </div>

            <h1 className="text-3xl font-bold pt-8 lg:pt-0 uppercase text-center">
              Profile information
            </h1>
            <div className="mx-auto lg:w-768 lg:mx-0  pt-3 border-b-2 border-green-500 opacity-25"></div>

            {user ? (
              <div>
                <h1 className="uppercase text-center">About</h1>
                <p className="pb-2">Name: {user.name}</p>
                <p className="pb-2">{user.bio}</p>
                <p>Bookings: {user._count.bookings}</p>
                <p>Active Venues: {user._count.venues}</p>
              </div>
            ) : (
              <p>Loading user profile...</p>
            )}
          </div>
        </div>

        <div className="w-full lg:w-2/5 relative">
          <img
            src={
              user?.avatar?.url ||
              "https://ht.ksdr1.net/wp-content/uploads/sites/3/2016/06/no-picture-available-icon-8.png"
            }
            className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
            alt="Profile"
          />
          <button
            onClick={openModal}
            className="hidden lg:block absolute bottom-4 right-4 p-2 bg-indigo-500 text-white rounded-full"
          >
            Change
          </button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-4">Bookings</h2>
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4 border rounded-lg shadow">
                <p>
                  <strong>Booking ID:</strong> {booking.id}
                </p>
                <p>
                  <strong>Date From:</strong>{" "}
                  {new Date(booking.dateFrom).toLocaleDateString()}
                </p>
                <p>
                  <strong>Date To:</strong>{" "}
                  {new Date(booking.dateTo).toLocaleDateString()}
                </p>
                <p>
                  <strong>Guests:</strong> {booking.guests}
                </p>
                <button
                  onClick={() => openUpdateModal(booking)}
                  className="bg-blue-500 text-white p-2 rounded mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => openDeleteModal(booking)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <h2 className="text-2xl font-bold mb-4">Change Profile Image</h2>
        <input
          type="text"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Enter new image URL"
          className="w-full p-2 border rounded mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error.message}</p>}
        <button
          onClick={handleImageChange}
          className="bg-indigo-500 text-white p-2 rounded mr-2"
        >
          Update Image
        </button>
        <button
          onClick={closeModal}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Cancel
        </button>
      </Modal>

      <Modal isOpen={isUpdateModalOpen} setIsOpen={setIsUpdateModalOpen}>
        <h2 className="text-2xl font-bold mb-4">Update Booking</h2>
        <input
          type="date"
          value={updateFormData.dateFrom}
          onChange={(e) =>
            setUpdateFormData({ ...updateFormData, dateFrom: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="date"
          value={updateFormData.dateTo}
          onChange={(e) =>
            setUpdateFormData({ ...updateFormData, dateTo: e.target.value })
          }
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="number"
          value={updateFormData.guests}
          onChange={(e) =>
            setUpdateFormData({
              ...updateFormData,
              guests: Number(e.target.value),
            })
          }
          className="w-full p-2 border rounded mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error.message}</p>}
        <button
          onClick={handleUpdateBooking}
          className="bg-indigo-500 text-white p-2 rounded mr-2"
        >
          Update Booking
        </button>
        <button
          onClick={closeUpdateModal}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Cancel
        </button>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen}>
        <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this booking?</p>
        {error && <p className="text-red-500 mb-4">{error.message}</p>}
        <button
          onClick={handleDeleteBooking}
          className="bg-red-500 text-white p-2 rounded mr-2"
        >
          Delete
        </button>
        <button
          onClick={closeDeleteModal}
          className="bg-gray-500 text-white p-2 rounded border-solid "
        >
          Cancel
        </button>
      </Modal>
    </>
  );
};

export default Profile;
