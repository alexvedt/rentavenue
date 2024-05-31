import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import logo from "../../assets/logo.jpg";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [data, setData] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const navigateToHome = () => {
    setTimeout(() => {
      navigate({ to: "/" });
    }, 2000);
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const { email, password } = event.target.elements;

    const payload = {
      email: email.value,
      password: password.value,
    };
    console.log("Request Payload:", payload);

    try {
      const res = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (res.ok) {
        console.log("API Response:", data);
        setData(data.data);
        console.log(data);
        setIsSuccess(true);
        localStorage.setItem("access_token", data.data.accessToken);
        localStorage.setItem("user_name", data.data.name);
        localStorage.setItem("apiKey", "0524f5f9-3062-4087-a04f-3893f8205295");

        console.log(
          "Access Token in Local Storage:",
          localStorage.getItem("access_token")
        );
        console.log(
          "User Name in Local Storage:",
          localStorage.getItem("user_name")
        );

        navigate("/");
      } else {
        if (res.status === 401) {
          setError({ password: "Invalid Password" });
        } else if (data.message === "Username not found") {
          setError({ email: "Username doesn't exist." });
        } else if (data.message === "Invalid password") {
          setError({ password: "Wrong password." });
        } else {
          setError({ general: "An unexpected error occurred." });
        }
      }

      setData(data);
      setIsSuccess(res.ok);
      navigateToHome();
    } catch (error) {
      console.warn("An error occurred", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (error.general) return <div>An error occurred: {error.general}</div>;

  return (
    <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 bg-background lg:px-8 card w-full max-w-[100%] h-[300px] md:h-auto   glass">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="w-auto h-10 mx-auto" src={logo} alt="markedZ" />
        <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-accent-500">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {isSuccess ? (
          <section>
            <p className="text-center text-green-600">
              Hello {data?.name}. Lets start bidding!
            </p>
          </section>
        ) : (
          <form className="space-y-6" onSubmit={handleOnSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
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
                  defaultValue=""
                  className="px-1 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error.email && <div className="text-red-500">{error.email}</div>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
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
                  className="block w-full rounded-md border-0 px-1 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {error.password && (
                <div className="text-red-500">{error.password}</div>
              )}
            </div>

            <div>
              <button
                disabled={isLoading}
                type="submit"
                className="flex w-full justify-center rounded-md bg-custom-aqua px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? "Signing in" : "Sign in"}
              </button>
            </div>
          </form>
        )}

        <p className="mt-10 text-sm text-center text-gray-500">
          Not a member?{" "}
          <a
            href="/register"
            className="font-semibold leading-6 text-custom-aqua hover:text-indigo-500"
          >
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
