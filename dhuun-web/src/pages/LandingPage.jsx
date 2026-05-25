import {
  Music4,
  Smartphone,
  PlayCircle,
} from 'lucide-react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  useEffect,
  useState,
} from 'react';

import useInstallPrompt
  from '../hooks/useInstallPrompt';

import useStandaloneMode
  from '../hooks/useStandaloneMode';

import IOSInstallSheet
  from '../components/onboarding/IOSInstallSheet';

import AppSplashScreen
  from '../components/onboarding/AppSplashScreen';

export default function
LandingPage() {

  const {
    install,
    isInstallable,
  } = useInstallPrompt();

  const navigate =
    useNavigate();

  const isStandalone =
    useStandaloneMode();

  const [
    showSplash,

    setShowSplash,

  ] = useState(false);

  // -----------------------------------
  // Platform Detection
  // -----------------------------------

  const isIOS =
    /iPad|iPhone|iPod/.test(
      navigator.userAgent
    );

  const isAndroid =
    /Android/.test(
      navigator.userAgent
    );

  // -----------------------------------
  // Installed App Launch
  // -----------------------------------

  useEffect(() => {

    if (!isStandalone) {
      return;
    }

    setShowSplash(true);

    const timeout =

      setTimeout(() => {

        navigate(
          '/app',
          {
            replace: true,
          }
        );

      }, 1800);

    return () =>
      clearTimeout(timeout);

  }, [
    isStandalone,
    navigate,
  ]);

  // -----------------------------------
  // Splash Screen
  // -----------------------------------

  if (showSplash) {

    return (
      <AppSplashScreen />
    );
  }

  return (

    <div className="relative min-h-screen overflow-hidden bg-[#07010F] text-white">

      {/* -------------------------------- */}
      {/* Ambient Background */}
      {/* -------------------------------- */}

      <div className="absolute top-[-120px] left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[140px]" />

      <div className="absolute bottom-[-180px] right-[-100px] h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-[140px]" />

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">

        {/* Logo */}

        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">

          <Music4 size={42} />

        </div>

        {/* Brand */}

        <h1 className="text-5xl font-black tracking-tight">

          Dhuun

        </h1>

        <p className="mt-3 text-lg text-white/70">

          Music for the soul.

        </p>

        {/* Description */}

        <p className="mt-8 max-w-sm text-sm leading-7 text-white/60">

          Discover immersive music,
          poetic lyrics,
          soulful artists,
          and cinematic listening experiences.

        </p>

        {/* CTA */}

        <div className="mt-12 flex w-full max-w-sm flex-col gap-4">

          {/* -------------------------------- */}
          {/* Android Install */}
          {/* -------------------------------- */}

          {isInstallable && (

            <button

              onClick={install}

              className="flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-semibold text-black transition active:scale-[0.98]"
            >

              <Smartphone size={20} />

              Install App

            </button>

          )}

          {/* -------------------------------- */}
          {/* Android Installed */}
          {/* -------------------------------- */}

          {!isInstallable &&
            isAndroid &&
            !isStandalone && (

            <button

              onClick={() => {

                navigate('/app');
              }}

              className="flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-semibold text-black transition active:scale-[0.98]"
            >

              <PlayCircle size={20} />

              Open App

            </button>

          )}

          {/* -------------------------------- */}
          {/* iPhone Install */}
          {/* -------------------------------- */}

          {!isInstallable &&
            isIOS &&
            !isStandalone && (

            <IOSInstallSheet />

          )}

          {/* -------------------------------- */}
          {/* Continue In Browser */}
          {/* -------------------------------- */}

          {!isStandalone && (

            <Link

              to="/app"

              className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-medium text-white/90 backdrop-blur-xl transition active:scale-[0.98]"
            >

              <PlayCircle size={20} />

              Continue in Browser

            </Link>

          )}

        </div>

        {/* Footer */}

        <div className="mt-16 text-xs tracking-wide text-white/40">

          Streaming reimagined for independent music.

        </div>

      </div>

    </div>
  );
}