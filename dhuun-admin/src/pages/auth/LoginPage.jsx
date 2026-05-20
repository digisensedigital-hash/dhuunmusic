import {
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import toast
  from 'react-hot-toast';

import {
  Music4,
} from 'lucide-react';

import {
  loginUser,
} from '../../api/auth';

import {
  useAuth,
} from '../../context/AuthContext';

export default function LoginPage() {

  const navigate =
    useNavigate();

  const {
    login,
  } = useAuth();

  const [
    form,
    setForm,
  ] = useState({
    email: '',
    password: '',
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  /* ----------------------------------- */
  /* Handle Change */
  /* ----------------------------------- */

  const handleChange =
    (e) => {
      setForm({
        ...form,

        [e.target.name]:
          e.target.value,
      });
    };

  /* ----------------------------------- */
  /* Handle Login */
  /* ----------------------------------- */

  const handleLogin =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const loginPromise =
          loginUser(form);

        toast.promise(
          loginPromise,
          {
            loading:
              'Signing in...',

            success:
              'Welcome back',

            error:
              'Login failed',
          }
        );

        const data =
          await loginPromise;

        login({
          token:
            data.token,

          user:
            data.user,
        });

        navigate('/');

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">

      <div className="w-full max-w-md rounded-3xl border border-zinc-900 bg-zinc-950 p-8 shadow-2xl">

        {/* ----------------------------------- */}
        {/* Logo */}
        {/* ----------------------------------- */}

        <div className="mb-8 flex flex-col items-center">

          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-black">

            <Music4 size={32} />

          </div>

          <h1 className="text-3xl font-bold text-white">
            Dhuun Admin
          </h1>

          <p className="mt-2 text-center text-sm text-zinc-500">
            Music operations, metadata, and catalog management platform.
          </p>

        </div>

        {/* ----------------------------------- */}
        {/* Form */}
        {/* ----------------------------------- */}

        <form
          onSubmit={
            handleLogin
          }
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={
                handleChange
              }
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={
                handleChange
              }
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none transition focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'Signing In...'
              : 'Sign In'}
          </button>

        </form>

      </div>

    </div>
  );
}