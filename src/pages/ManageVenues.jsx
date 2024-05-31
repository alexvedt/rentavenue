import Navigation from "../components/navbar";
import ManageVenues from "../components/creating-listing/";
export default function SingleItem() {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <section>
        <ManageVenues />
      </section>
    </>
  );
}
