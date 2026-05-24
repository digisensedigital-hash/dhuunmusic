import {
  useEffect,
  useState,
} from 'react';

export default function
useInstallPrompt() {

  const [
    deferredPrompt,

    setDeferredPrompt,

  ] = useState(null);

  const [
    isInstallable,

    setIsInstallable,

  ] = useState(false);

  useEffect(() => {

    const handler =
      (event) => {

        event.preventDefault();

        setDeferredPrompt(
          event
        );

        setIsInstallable(
          true
        );
      };

    window.addEventListener(
      'beforeinstallprompt',
      handler
    );

    return () => {

      window.removeEventListener(
        'beforeinstallprompt',
        handler
      );

    };

  }, []);

  const install =
    async () => {

      if (!deferredPrompt) {
        return false;
      }

      deferredPrompt.prompt();

      const {
        outcome,
      } =
        await deferredPrompt.userChoice;

      if (
        outcome === 'accepted'
      ) {

        setDeferredPrompt(
          null
        );

        setIsInstallable(
          false
        );

        return true;
      }

      return false;
    };

  return {

    install,

    isInstallable,

  };
}