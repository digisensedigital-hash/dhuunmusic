    import {
    ChevronDown,
    Pause,
    Play,
    SkipBack,
    SkipForward,
    ListMusic,
    Repeat,
    Shuffle,
    } from 'lucide-react';

    import {
    motion,
    AnimatePresence,
    } from 'framer-motion';

    import usePlayerStore
    from '../../store/playerStore';

    export default function
    FullscreenPlayer() {
    const {
        currentTrack,

        isPlaying,

        currentTime,

        duration,

        isExpandedPlayerOpen,

        togglePlayPause,

        playNextTrack,

        playPreviousTrack,

        closeExpandedPlayer,

        openQueueDrawer,

        seekTo,
    } = usePlayerStore();

    // -----------------------------------
    // Time Formatter
    // -----------------------------------

    const formatTime = (
        value
    ) => {
        if (!value) {
        return '0:00';
        }

        const mins =
        Math.floor(
            value / 60
        );

        const secs =
        Math.floor(
            value % 60
        )
            .toString()
            .padStart(2, '0');

        return `${mins}:${secs}`;
    };

    return (
        <AnimatePresence>
        {isExpandedPlayerOpen &&
            currentTrack && (
            <motion.div
                layoutId="player-shell"
                initial={{
                    y: '100%',
                    opacity: 0,
                }}
                animate={{
                    y: 0,
                    opacity: 1,
                }}
                exit={{
                y: '100%',
                opacity: 0,
                }}
                transition={{
                    type: 'spring',
                    damping: 34,
                    stiffness: 320,
                    mass: 0.9,
                }}
                drag="y"
                dragConstraints={{
                top: 0,
                bottom: 0,
                }}
                dragElastic={0.15}
                onDragEnd={(
                _,
                info
                ) => {
                if (
                    info.offset.y >
                    140
                ) {
                    closeExpandedPlayer();
                }
                }}
                className="fixed inset-0 z-[200] bg-[#07010F]/95 backdrop-blur-3xl text-white flex flex-col overflow-hidden touch-pan-y"
            >
                {/* -------------------------------- */}
                {/* Ambient Background */}
                {/* -------------------------------- */}

                <motion.div
                    animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.18, 0.28, 0.18],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-fuchsia-600 blur-[140px] rounded-full pointer-events-none"
                    />

                    <motion.div
                    animate={{
                        scale: [1, 1.12, 1],
                        opacity: [0.14, 0.24, 0.14],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute bottom-[-180px] right-[-100px] w-[420px] h-[420px] bg-purple-600 blur-[140px] rounded-full pointer-events-none"
                    />

                {/* -------------------------------- */}
                {/* Header */}
                {/* -------------------------------- */}

                <motion.div
                    initial={{
                        y: -20,
                        opacity: 0,
                    }}
                    animate={{
                        y: 0,
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.03,
                        duration: 0.35,
                    }}
                    className="relative z-10 flex items-center justify-between px-6 pt-[max(24px,env(safe-area-inset-top))] pb-6">
                <button
                    onClick={
                    closeExpandedPlayer
                    }
                    className="w-11 h-11 rounded-full bg-white/10 backdrop-blur flex items-center justify-center"
                >
                    <ChevronDown
                    size={24}
                    />
                </button>

                <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                    Now Playing
                    </p>
                </div>

                <div className="w-11" />
                </motion.div>

                {/* -------------------------------- */}
                {/* Content */}
                {/* -------------------------------- */}

                <motion.div
                    initial={{
                        scale: 0.96,
                        opacity: 0,
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.04,
                        duration: 0.45,
                        ease: 'easeOut',
                    }}
                    className="relative z-10 flex-1 flex flex-col px-8"
                >
                {/* Artwork */}

                <motion.div
                    initial={{
                        scale: 0.92,
                        opacity: 0,
                        rotate: -2,
                        y: 24,
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        rotate: 0,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.65,
                        ease: 'easeOut',
                    }}
                    className="mt-6 flex justify-center"
                    >
                    <motion.div
                        layoutId="player-artwork"
                        initial={{
                            y: 18,
                            opacity: 0,
                        }}
                        animate={{
                            y: 0,
                            opacity: 1,
                        }}
                        transition={{
                            delay: 0.12,
                            duration: 0.6,
                            ease: 'easeOut',
                        }}
                        className="w-[68vw] max-w-[300px] aspect-square rounded-[28px] overflow-hidden shadow-2xl bg-white/5"
                        >
                    {currentTrack.coverImage ? (
                        <img
                        src={
                            currentTrack.coverImage
                        }
                        alt={
                            currentTrack.title
                        }
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-6xl font-black bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500">
                        ♪
                        </div>
                    )}
                    </motion.div>
                </motion.div>

                {/* Track Info */}

                <motion.div
                    initial={{
                    y: 20,
                    opacity: 0,
                    }}
                    animate={{
                    y: 0,
                    opacity: 1,
                    }}
                    transition={{
                    delay: 0.12,
                    }}
                    className="mt-10"
                >
                    <h1 className="text-2xl font-black tracking-tight">
                    {
                        currentTrack.title
                    }
                    </h1>

                    <p className="mt-2 text-white/60 text-lg">
                    {currentTrack
                        .artist
                        ?.stageName ||
                        'Unknown Artist'}
                    </p>
                </motion.div>

                {/* -------------------------------- */}
                {/* Audio Visualizer */}
                {/* -------------------------------- */}

                <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    delay: 0.14,
                }}
                className="mt-10 flex items-end justify-center gap-1.5 h-10"
                >
                {[...Array(12)].map(
                    (_, index) => (
                    <motion.span
                        key={index}
                        animate={{
                        height: isPlaying
                            ? [
                                10,
                                30 +
                                Math.random() *
                                    20,
                                12,
                            ]
                            : 10,
                        }}
                        transition={{
                        duration:
                            0.6 +
                            Math.random() *
                            0.8,
                        repeat:
                            Infinity,
                        repeatType:
                            'mirror',
                        }}
                        className="w-1 rounded-full bg-gradient-to-t from-fuchsia-500 to-purple-300"
                    />
                    )
                )}
                </motion.div>

                {/* Progress */}

                <motion.div
                    initial={{
                    y: 20,
                    opacity: 0,
                    }}
                    animate={{
                    y: 0,
                    opacity: 1,
                    }}
                    transition={{
                    delay: 0.16,
                    }}
                    className="mt-10"
                >
                    
                    <motion.div
                    layoutId="player-progress"
                    className="h-[3px] w-full bg-white/10 rounded-full mb-4 overflow-hidden"
                    >
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{
                        width: `${
                            duration > 0
                            ? (currentTime /
                                duration) *
                                100
                            : 0
                        }%`,
                        }}
                    />
                    </motion.div>
                    
                    <input
                    type="range"
                    min={0}
                    max={
                        duration || 0
                    }
                    value={
                        currentTime
                    }
                    onChange={(
                        e
                    ) =>
                        seekTo(
                        Number(
                            e.target
                            .value
                        )
                        )
                    }
                    className="w-full accent-white"
                    />

                    <div className="flex items-center justify-between text-sm text-white/50 mt-2">
                    <span>
                        {formatTime(
                        currentTime
                        )}
                    </span>

                    <span>
                        {formatTime(
                        duration
                        )}
                    </span>
                    </div>
                </motion.div>

                {/* Controls */}

                <motion.div
                    initial={{
                    y: 20,
                    opacity: 0,
                    }}
                    animate={{
                    y: 0,
                    opacity: 1,
                    }}
                    transition={{
                    delay: 0.2,
                    }}
                    className="mt-8 flex items-center justify-between"
                >
                    <button className="text-white/60">
                    <Shuffle
                        size={24}
                    />
                    </button>

                    <button
                    onClick={
                        playPreviousTrack
                    }
                    >
                    <SkipBack
                        size={30}
                    />
                    </button>

                    <motion.button
                    whileTap={{
                        scale: 0.92,
                    }}
                    onClick={
                        togglePlayPause
                    }
                    className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl"
                    >
                    {isPlaying ? (
                        <Pause
                        size={28}
                        />
                    ) : (
                        <Play
                        size={28}
                        className="ml-1"
                        />
                    )}
                    </motion.button>

                    <button
                    onClick={
                        playNextTrack
                    }
                    >
                    <SkipForward
                        size={30}
                    />
                    </button>

                    <button className="text-white/60">
                    <Repeat
                        size={24}
                    />
                    </button>
                </motion.div>

                {/* Bottom Actions */}

                <motion.div
                    initial={{
                    opacity: 0,
                    }}
                    animate={{
                    opacity: 1,
                    }}
                    transition={{
                    delay: 0.24,
                    }}
                    className="mt-auto pb-[max(18px,env(safe-area-inset-bottom))] pt-6 flex items-center justify-center"
                >
                    <button
                    onClick={
                        openQueueDrawer
                    }
                    className="flex items-center gap-3 text-white/70"
                    >
                    <ListMusic
                        size={22}
                    />

                    <span className="text-sm font-medium">
                        Up Next
                    </span>
                    </button>
                </motion.div>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
    );
    }