import {
  useEffect,
  useState,
} from 'react';

export default function
useStandaloneMode() {

  const [
    isStandalone,

    setIsStandalone,

  ] = useState(false);

  useEffect(() => {

    const standalone =

      window.matchMedia(
        '(display-mode: standalone)'
      ).matches ||

      window.navigator.standalone === true;

    setIsStandalone(
      standalone
    );

  }, []);

  return isStandalone;
}