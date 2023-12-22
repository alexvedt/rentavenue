import Navigation from "../components/navbar";
import ListingItem from "../components/single-listing";

export default function SingleItem() {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <section>
        <ListingItem />
      </section>
    </>
  );
}
