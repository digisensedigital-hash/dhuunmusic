import {
  Navigate,
} from 'react-router-dom';

import authStore
  from '../../store/auth/authStore';

export default function
ProtectedRoute({
  children,
}) {

  const {
    token,
    isHydrating,
  } = authStore();

  // -----------------------------------
  // Hydration Pending
  // -----------------------------------

  if (isHydrating) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-[#07070B] text-white">

        <div className="text-sm text-white/60">

          Loading...

        </div>

      </div>

    );

  }

  // -----------------------------------
  // Unauthenticated
  // -----------------------------------

  if (!token) {

    return (
      <Navigate
        to="/app/login"
        replace
      />
    );

  }

  // -----------------------------------
  // Authorized
  // -----------------------------------

  return children;

}