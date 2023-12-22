import { useState, useEffect } from "react";
import { API_URL } from "../../lib/constants";
import UserProfileDetails from "../user-tabs";

const Profile = () => {
  const userId = localStorage.getItem("user_name");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/profiles/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("userData:", userData);
          setUser(userData);
        } else {
          // Handle error (e.g., token expired, unauthorized)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  return (
    <>
      <div className="container mx-auto flex items-center justify-center h-screen">
        <div className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0">
          <div className="p-4 md:p-12 text-center lg:text-left">
            {/* Image for mobile view */}
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
            <div className="mx-auto lg:mx-0  pt-3 border-b-2 border-green-500 opacity-25"></div>
            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">
              <svg
                className="h-4 fill-current text-green-700 pr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              ></svg>{" "}
              {user?.occupation}
            </p>

            {user ? (
              <div>
                <h1 className="uppercase text-center">About</h1>
                <p className="pb-2">Name: {user.name}</p>
                <p className="pb-2">
                  Looks like this API does not provide an about section yet
                </p>
                <p className="pb-2">Credits: {user.credits}</p>
                <p>Listings: {user._count.listings.id}</p>
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

      <div className="container mx-auto flex items-center">
        <UserProfileDetails />
      </div>
    </>
  );
};

export default Profile;
