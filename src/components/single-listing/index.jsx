import { useEffect, useState } from "react";
import { API_URL } from "../../lib/constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ListingItem = () => {
  const [listing, setListing] = useState(null); // Ensure initial state is null
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams(window.location.search);
        const venueId = params.get("venueId");
        const url = new URL(`${API_URL}/venues/${venueId}`);
        console.log(venueId, "venueid");

        const response = await fetch(url.href);
        console.log(response, "response");

        if (!response.ok) {
          throw new Error("Failed to fetch venue");
        }

        const data = await response.json();
        setListing(data.data);
        console.log(data, "data");
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenue();
  }, []);

  useEffect(() => {
    if (startDate && endDate && listing) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalPrice(diffDays * listing.price);
    }
  }, [startDate, endDate, listing]);

  const handleBooking = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "X-Noroff-API-Key": localStorage.getItem("apiKey"),
        },
        body: JSON.stringify({
          dateFrom: startDate.toISOString(),
          dateTo: endDate.toISOString(),
          guests,
          venueId: listing.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      const data = await response.json();
      alert(`Booking successful! Booking ID: ${data.data.id}`);
    } catch (error) {
      alert(`Booking failed: ${error.message}`);
    }
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (error || !listing) return <h1>No listing found. {error?.message}</h1>;

  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen">
      <div className="w-full lg:w-2/5 mb-8">
        <img
          src={
            listing?.media[0]?.url || "https://source.unsplash.com/MP0IUfwrn0A"
          }
          className="rounded-lg shadow-2xl w-full"
          alt={listing?.media[0]?.alt || "Venue Image"}
        />
      </div>
      <div className="w-full lg:w-3/5 rounded-lg shadow-2xl bg-white opacity-75 p-6">
        <h1 className="text-3xl font-bold text-center uppercase">
          {listing?.name || "Unknown Title"}
        </h1>
        <div className="mx-auto pt-3 border-b-2 border-text-500 opacity-25"></div>
        <div className="flex flex-col items-center mt-4">
          <p className="pt-2">
            Address: {listing?.location?.address || "Unknown Address"},{" "}
            {listing?.location?.city || "Unknown City"}
          </p>
          <p className="pt-2">
            Country: {listing?.location?.country || "Unknown Country"}
          </p>
          <p className="pt-2">Price: ${listing?.price || "Unknown Price"}</p>
          <p className="pt-2">Max Guests: {listing?.maxGuests || "Unknown"}</p>
          <p className="pt-2">Rating: {listing?.rating || "Unknown"}</p>
        </div>
        <div className="p-4 rounded-lg shadow-lg text-center">
          <p className="mb-4">{listing?.description}</p>
        </div>
        <div className="mb-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="input"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="input"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            <strong>Guests:</strong>
          </label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            min="1"
            max={listing?.maxGuests}
            className="input"
          />
        </div>
        <div className="mb-4">
          <p className="text-xl">
            <strong>Total Price:</strong> ${totalPrice}
          </p>
        </div>
        <button
          className="btn bg-text-500 text-text-900 py-2 px-4 rounded-full"
          onClick={handleBooking}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ListingItem;
