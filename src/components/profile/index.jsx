import { useState, useEffect } from "react";
import { API_URL } from "../../lib/constants";

const Profile = () => {
  const userId = localStorage.getItem("user_name");
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error.message}</h1>;

  return (
    <>
      <div className="container mx-auto flex items-center justify-center h-screen">
        <div className="w-full lg:w-4/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0">
          <div className="p-4 md:p-12 text-center lg:text-left">
            <div
              alt="Profile image"
              className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
              style={{
                backgroundImage: `url('${
                  user?.avatar || "https://source.unsplash.com/MP0IUfwrn0A"
                }')`,
              }}
            ></div>

            <h1 className="text-3xl font-bold pt-8 lg:pt-0 uppercase text-center">
              Profile information
            </h1>
            <div className="mx-auto lg:w-768 lg:mx-0  pt-3 border-b-2 border-green-500 opacity-25"></div>
            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-center">
              {user?.occupation}
            </p>

            {user ? (
              <div>
                <h1 className="uppercase text-center">About</h1>
                <p className="pb-2">Name: {user.name}</p>
                <p className="pb-2">{user.bio}</p>
                <p>Bookings: {user._count.bookings}</p>
                <p>Venues: {user._count.venues}</p>
              </div>
            ) : (
              <p>Loading user profile...</p>
            )}
          </div>
        </div>

        <div className="w-full lg:w-2/5">
          <img
            src={user?.avatar || "https://source.unsplash.com/MP0IUfwrn0A"}
            className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block"
            alt="Profile"
          />
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
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(booking.created).toLocaleDateString()}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {new Date(booking.updated).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </>
  );
};

export default Profile;
