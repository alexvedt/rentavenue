import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const navigateToHome = () => {
    setTimeout(() => {
      navigate({ to: "/login" });
    }, 2000);
  };

  const validateEmail = (email) => {
    const emailRegex =
      /^(?:[a-zA-Z0-9._%+-]+@stud\.noroff\.no|[^@\s]+@noroff\.no)$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^.{8,}$/;
    return passwordRegex.test(password);
  };

  const validateAvatar = (avatar) => {
    if (avatar.trim() === "") {
      return true;
    }

    const imageLinkRegex = /\.(jpeg|jpg|png|gif)$/i;
    return imageLinkRegex.test(avatar);
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const { email, password, name, avatar, venueManager } =
      event.target.elements;

    let fieldErrors = {};

    if (!name.value.match(/^[a-zA-Z0-9_]+$/)) {
      fieldErrors.name =
        "Name must not contain punctuation symbols apart from underscore (_).";
    }

    if (!validateEmail(email.value)) {
      fieldErrors.email =
        "Invalid email address. Please use a valid stud.noroff.no or noroff.no email.";
    }

    if (!validateAvatar(avatar.value)) {
      fieldErrors.avatar = "Avatar link must end with '.jpeg' or '.jpg'.";
    }

    if (!validatePassword(password.value)) {
      fieldErrors.password = "Password must be at least 8 characters.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setError(fieldErrors);
      return;
    }

    const requestData = {
      name: name.value,
      email: email.value,
      password: password.value,
      venueManager: venueManager.checked,
    };

    setIsLoading(true);

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        localStorage.setItem("email", email.value);
        localStorage.setItem("user_name", name.value);
        localStorage.setItem("venueManager", venueManager.checked);
        navigateToHome();
      } else {
        if (response.status === 400 || response.status === 409) {
          setError({
            name: "This username is already taken. Choose another one.",
          });
        } else {
          console.error("Error response data:", data); // Log the data
          setError({ general: data.message });
        }
      }
    } catch (error) {
      console.warn("An error occurred", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 bg-custom lg:px-8 card w-full max-w-[100%] h-[300px] md:h-auto  glass">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center color-white	">
          Make a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {isSuccess ? (
          <section>
            <p className="text-center text-white color-white">
              Welcome {localStorage.getItem("user_name")}. You will now redirect
              to the login page!
            </p>
          </section>
        ) : (
          <form className="space-y-6" onSubmit={handleOnSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-"
              >
                Name
              </label>

              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  defaultValue=""
                  className="px-1 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error.name && (
                <p className="text-red-500 text-xs mt-2">{error.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-custom-aqua"
              >
                Email address
              </label>

              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue={`${Math.floor(
                    Math.random() * 9999999
                  )}-last@stud.noroff.no`}
                  className="px-1 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white- focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error.email && (
                <p className="text-red-500 text-xs mt-2">{error.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium leading-6 text-custom-aqua"
              >
                Avatar Link (Optional)
              </label>

              <div className="mt-2">
                <input
                  id="avatar"
                  name="avatar"
                  type="text"
                  autoComplete="avatar"
                  className="px-1 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error.avatar && (
                <p className="text-red-500 text-xs mt-2">{error.avatar}</p>
              )}
            </div>

            <div>
              <div className="flex flex-column items-center justify-between">
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium leading-6 text-custom-aqua"
                >
                  Venue manager? (Optional)
                </label>{" "}
                <input
                  type="checkbox"
                  name="venueManager"
                  id="venueManager"
                  className="rounded-md border-0 px-1 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-custom-aqua"
                >
                  Password
                </label>
              </div>

              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  defaultValue=""
                  className="block w-full rounded-md border-0 px-1 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error.password && (
                <p className="text-red-500 text-xs mt-2">{error.password}</p>
              )}
            </div>

            <div>
              <button
                disabled={isLoading}
                type="submit"
                className="flex w-full justify-center rounded-md bg-custom-aqua px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? "Registering" : "Sign up"}
              </button>
            </div>
          </form>
        )}

        <p className="mt-10 text-sm text-center text-gray-500">
          Already a member?{" "}
          <a
            href="/login"
            className="font-semibold leading-6 text-custom-aqua hover:text-indigo-500"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
