import Navigation from "../components/navbar";
import ListingItem from "../components/single-listing";

/**
 * Displays a single post
 * @see https://docs.noroff.dev/social-endpoints/posts
 */
export default function PostPage() {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <h1>A single post</h1>
      <section>
        <ListingItem />
      </section>
    </>
  );
}
