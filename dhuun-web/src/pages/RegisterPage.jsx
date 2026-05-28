import {
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  toast,
} from 'sonner';

import register
  from '../api/auth/register';

import authStore
  from '../store/auth/authStore';

export default function RegisterPage() {

  const navigate =
    useNavigate();

  const {
    setUser,
    setToken,
  } = authStore();

  const [
    name,
    setName,
  ] = useState('');

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

  const handleRegister =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const response =
          await register({

            name,
            email,
            password,

          });

        const {
          token,
          user,
        } = response;

        /* ----------------------------------- */
        /* Auth Hydration */
        /* ----------------------------------- */

        setToken(token);

        setUser(user);

        /* ----------------------------------- */
        /* Success */
        /* ----------------------------------- */

        toast.success(
          'Welcome to Dhuun'
        );

        /* ----------------------------------- */
        /* Redirect */
        /* ----------------------------------- */

        navigate('/');

      } catch (error) {

        toast.error(

          error?.response
            ?.data?.message ||

          error?.message ||

          'Registration failed'
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

            Join Dhuun

          </h1>

          <p className="mt-3 text-sm text-zinc-500">

            Unlock immersive listening features

          </p>

        </div>

        {/* Form */}

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          {/* Name */}

          <div>

            <label className="mb-2 block text-sm font-medium text-zinc-300">

              Name

            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none transition focus:border-zinc-600"
              placeholder="Enter your name"
            />

          </div>

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
              placeholder="Create a password"
            />

          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {loading
              ? 'Creating account...'
              : 'Create Account'}

          </button>

        </form>

      </div>

    </div>

  );

}