/**
 * Displays a single profile
 * @see https://docs.noroff.dev/social-endpoints/profiles
 */
import Profile from "../components/profile";
import Navigation from "../components/navbar";
export default function ProfilePage() {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <Profile />
      </main>
    </>
  );
}
