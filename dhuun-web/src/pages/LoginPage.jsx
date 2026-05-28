import {
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  toast,
} from 'sonner';

import login
  from '../api/auth/login';

import authStore
  from '../store/auth/authStore';

export default function LoginPage() {

  const navigate =
    useNavigate();

  const {
    setUser,
    setToken,
  } = authStore();

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleLogin =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const {
          token,
          user,
        } = await login({

          email,
          password,

        });

        /* ----------------------------------- */
        /* Auth Hydration */
        /* ----------------------------------- */

        setToken(token);

        setUser(user);

        /* ----------------------------------- */
        /* Success */
        /* ----------------------------------- */

        toast.success(
          'Welcome back to Dhuun'
        );

        /* ----------------------------------- */
        /* Redirect */
        /* ----------------------------------- */

        navigate('/app');

      } catch (error) {

        toast.error(

          error?.response
            ?.data?.message ||

          error?.message ||

          'Login failed'
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="flex min-h-screen items-center justify-center bg-black px-6">

      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">

        {/* Header */}

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-white">

            Dhuun

          </h1>

          <p className="mt-3 text-sm text-zinc-500">

            Continue your listening journey

          </p>

        </div>

        {/* Form */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="mb-2 block text-sm font-medium text-zinc-300">

              Email

            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none transition focus:border-zinc-600"
              placeholder="Enter your email"
            />

          </div>

          {/* Password */}

          <div>

            <label className="mb-2 block text-sm font-medium text-zinc-300">

              Password

            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none transition focus:border-zinc-600"
              placeholder="Enter your password"
            />

          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading
              ? 'Signing in...'
              : 'Login'}

          </button>

        </form>

      </div>

    </div>

  );

}