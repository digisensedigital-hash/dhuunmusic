import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const AuthContext =
  createContext();

/* ----------------------------------- */
/* Provider */
/* ----------------------------------- */

export function AuthProvider({
  children,
}) {

  const [
    user,
    setUser,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /* ----------------------------------- */
  /* Restore Session */
  /* ----------------------------------- */

  useEffect(() => {

    const token =
      localStorage.getItem(
        'token'
      );

    const storedUser =
      localStorage.getItem(
        'user'
      );

    if (
      token &&
      storedUser
    ) {
      try {
        setUser(
          JSON.parse(
            storedUser
          )
        );
      } catch (error) {
        console.error(error);

        localStorage.removeItem(
          'token'
        );

        localStorage.removeItem(
          'user'
        );
      }
    }

    setLoading(false);

  }, []);

  /* ----------------------------------- */
  /* Login */
  /* ----------------------------------- */

  const login =
    ({
      token,
      user,
    }) => {

      localStorage.setItem(
        'token',
        token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(user)
      );

      setUser(user);
    };

  /* ----------------------------------- */
  /* Logout */
  /* ----------------------------------- */

  const logout =
    () => {

      localStorage.removeItem(
        'token'
      );

      localStorage.removeItem(
        'user'
      );

      setUser(null);
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated:
          !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ----------------------------------- */
/* Hook */
/* ----------------------------------- */

export function useAuth() {
  return useContext(
    AuthContext
  );
}