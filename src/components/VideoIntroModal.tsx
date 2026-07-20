import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Captions, 
  SkipForward, 
  RotateCcw,
  Camera,
  Layers,
  Sliders,
  AudioLines
} from "lucide-react";
import { ImageSlots } from "@/types";

interface VideoIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageSlots;
  currentTheme: string;
}

const INTRO_SCENES = [
  {
    title: "Scene 1: Professional Identity",
    subtitle: "Hello and welcome! I am Professor Vicky Kumar, Assistant Professor in Computer Science and MERN Stack Software Engineer.",
    imageKey: "hero" as keyof ImageSlots,
    duration: 8000, // ms
    filter: "contrast-105 saturate-105"
  },
  {
    title: "Scene 2: Academic Heritage",
    subtitle: "Welcome to Gulzar Group of Institutes, where I lead student mentorship, placement training, and laboratory curriculum designs.",
    imageKey: "campus" as keyof ImageSlots,
    duration: 8000,
    filter: "sepia-10 saturate-110 contrast-105"
  },
  {
    title: "Scene 3: Full-Stack Innovation",
    subtitle: "I engineer enterprise solutions, holding active patents in computer intelligence, IoT automation, and high-performance server architectures.",
    imageKey: "hero" as keyof ImageSlots,
    duration: 8000,
    filter: "hue-rotate-15 contrast-110"
  },
  {
    title: "Scene 4: Dynamic Student Mentorship",
    subtitle: "In my personal downtime, I consult with global recruiters, design placement mock interviews, and build tech resources.",
    imageKey: "casual" as keyof ImageSlots,
    duration: 8000,
    filter: "saturate-120 brightness-95"
  }
];

export default function VideoIntroModal({ isOpen, onClose, images, currentTheme }: VideoIntroModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState(0); // in ms
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [cinematicEffect, setCinematicEffect] = useState<"pan" | "zoom" | "slide">("zoom");
  
  const sceneTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const totalDuration = INTRO_SCENES.reduce((acc, scene) => acc + scene.duration, 0);
  const activeScene = INTRO_SCENES[currentSceneIdx];

  // Speech Synthesis Controller
  const speakCurrentSubtitle = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    // Cancel any current speaking
    window.speechSynthesis.cancel();

    if (isMuted || !isPlaying) return;

    const utterance = new SpeechSynthesisUtterance(activeScene.subtitle);
    utterance.rate = 0.92; // Professional pacing
    utterance.pitch = 0.90; // Slightly lower pitch for a richer, more masculine resonance
    
    // Try to find a high-quality English MALE voice to represent Professor Vicky Kumar
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith("en") || v.lang.startsWith("hi"));

    // Male-specific voice identifiers (English/Hindi English accents)
    const maleKeywords = [
      "google uk english male",
      "google us english male",
      "microsoft david",
      "microsoft george",
      "microsoft ravi",
      "david",
      "george",
      "ravi",
      "mark",
      "daniel",
      "james",
      "male"
    ];

    let selectedVoice = null;
    for (const keyword of maleKeywords) {
      const match = englishVoices.find(v => v.name.toLowerCase().includes(keyword));
      if (match) {
        selectedVoice = match;
        break;
      }
    }

    if (!selectedVoice) {
      selectedVoice = englishVoices.find(v => v.name.toLowerCase().includes("male"));
    }
    if (!selectedVoice) {
      selectedVoice = englishVoices.find(v => v.name.includes("Google") || v.name.includes("Natural"));
    }
    if (!selectedVoice) {
      selectedVoice = englishVoices[0] || voices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      // Auto transition once speaking is finished if we are near the end of the scene duration
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Start Playing
  const startPlaying = () => {
    setIsPlaying(true);
  };

  // Pause Playing
  const pausePlaying = () => {
    setIsPlaying(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
  };

  // Stop / Reset Speech Synthesis
  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Trigger speech when scene shifts or play/pause/mute state changes
  useEffect(() => {
    if (isOpen && isPlaying) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          speakCurrentSubtitle();
        }
      }
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.pause();
      }
    }
  }, [currentSceneIdx, isPlaying, isMuted]);

  // Scene cycle timer
  useEffect(() => {
    if (!isOpen) return;

    if (isPlaying) {
      // Start progress tick interval
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const nextTime = prev + 100;
          if (nextTime >= totalDuration) {
            // Video finished, loop to beginning or stop
            setIsPlaying(false);
            stopSpeech();
            setCurrentSceneIdx(0);
            return 0;
          }
          
          // Calculate which scene we are in based on nextTime
          let accumulated = 0;
          let foundIdx = 0;
          for (let i = 0; i < INTRO_SCENES.length; i++) {
            accumulated += INTRO_SCENES[i].duration;
            if (nextTime < accumulated) {
              foundIdx = i;
              break;
            }
          }
          if (foundIdx !== currentSceneIdx) {
            setCurrentSceneIdx(foundIdx);
            // Randomly swap cinematic camera movement for variety
            const effects: ("pan" | "zoom" | "slide")[] = ["pan", "zoom", "slide"];
            setCinematicEffect(effects[Math.floor(Math.random() * effects.length)]);
          }
          
          return nextTime;
        });
      }, 100);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isOpen, isPlaying, currentSceneIdx, totalDuration]);

  // Handle modal mount/unmount behaviors
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setCurrentSceneIdx(0);
      setCurrentTime(0);
    } else {
      setIsPlaying(false);
      stopSpeech();
    }
    return () => {
      stopSpeech();
    };
  }, [isOpen]);

  // Support lazy voice loaded events in browsers (e.g. Chrome, Safari)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const handleVoicesChanged = () => {
      if (isOpen && isPlaying) {
        speakCurrentSubtitle();
      }
    };
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, [isOpen, isPlaying, currentSceneIdx]);

  // Jump to specific scene
  const handleSceneSelect = (idx: number) => {
    let targetTime = 0;
    for (let i = 0; i < idx; i++) {
      targetTime += INTRO_SCENES[i].duration;
    }
    setCurrentTime(targetTime);
    setCurrentSceneIdx(idx);
    setIsPlaying(true);
  };

  // Skip 5 seconds forward
  const handleSkipForward = () => {
    const skipAmount = 5000;
    setCurrentTime((prev) => {
      const nextTime = Math.min(prev + skipAmount, totalDuration - 500);
      let accumulated = 0;
      let foundIdx = 0;
      for (let i = 0; i < INTRO_SCENES.length; i++) {
        accumulated += INTRO_SCENES[i].duration;
        if (nextTime < accumulated) {
          foundIdx = i;
          break;
        }
      }
      setCurrentSceneIdx(foundIdx);
      return nextTime;
    });
  };

  // Replay from start
  const handleReplay = () => {
    setCurrentTime(0);
    setCurrentSceneIdx(0);
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  // Format milliseconds to mm:ss format
  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Check if portrait image is a raw SVG string or typical asset path
  const renderSlideImage = (key: keyof ImageSlots) => {
    const imgSource = images[key];
    const isSvg = imgSource.startsWith("<svg") || imgSource.startsWith("data:image/svg");

    // Camera movement class mappings
    let effectClass = "scale-105";
    if (isPlaying) {
      if (cinematicEffect === "zoom") effectClass = "animate-zoom-in-slow";
      else if (cinematicEffect === "pan") effectClass = "animate-pan-left-right";
      else effectClass = "animate-ken-burns";
    }

    if (isSvg) {
      return (
        <div 
          className={`w-full h-full flex items-center justify-center bg-indigo-950/20 transform ${effectClass}`}
          dangerouslySetInnerHTML={{ __html: imgSource }}
        />
      );
    }

    return (
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
        {/* Blurry cinematic background fills outer frame bounds nicely */}
        <img
          src={imgSource}
          alt="Ambient Background Blur"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-40 select-none pointer-events-none scale-110"
        />

        {/* Floating crisp foreground image with shadow borders */}
        <div className="relative h-[82%] max-w-[90%] md:max-w-[75%] w-full flex items-center justify-center z-10 rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-black/20">
          <img
            src={imgSource}
            alt="Intro Scene Vicky Kumar"
            referrerPolicy="no-referrer"
            className={`h-full w-full object-contain transition-transform duration-[8000ms] ease-out ${effectClass} ${activeScene.filter}`}
          />
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-2 sm:p-4">
        {/* Cinematic Backdrop Blur Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Studio Video Monitor Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`relative w-full max-w-4xl bg-black rounded-xl border overflow-hidden shadow-2xl flex flex-col ${
            currentTheme === "developer" ? "border-cyan-500 font-mono text-cyan-400" : "border-zinc-800 text-zinc-100"
          }`}
          style={{ height: "calc(100vh - 40px)", maxHeight: "680px" }}
        >
          {/* Monitor Top Control Panel / Status Line */}
          <div className="bg-zinc-950 border-b border-zinc-900 px-4 py-2.5 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPlaying ? "bg-red-500" : "bg-yellow-500"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? "bg-red-600" : "bg-yellow-500"}`}></span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 font-bold">VICKY_STUDIO_AI:</span>
                <span className={isPlaying ? "text-emerald-400 font-bold" : "text-amber-500"}>
                  {isPlaying ? "● LIVE PRESENTATION RUNNING" : "|| RECORDING PAUSED"}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-zinc-400" />
                1080P FHD 60FPS
              </span>
              <span>ISO 400</span>
              <span>SHUTTER 1/120</span>
              <span>H.264 HEVC</span>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
              title="Exit Video Suite"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Screen Display (Aspect 16:9 responsive window) */}
          <div className="relative flex-1 bg-neutral-950 overflow-hidden flex items-center justify-center">
            {/* Aspect Ratio Screen Frame */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
              {renderSlideImage(activeScene.imageKey)}
            </div>

            {/* Retro scanline, grain, and glow overlay filters */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/30 mix-blend-overlay" />
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-40" />

            {/* Audio Waves Visualizer Ticker during play */}
            {isPlaying && (
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-xs border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <AudioLines className="w-4 h-4 text-cyan-400 animate-pulse" />
                <div className="flex gap-0.5 items-end h-3 w-8">
                  <div className="bg-cyan-400 w-1 rounded-xs animate-visualizer-bar-1 h-2"></div>
                  <div className="bg-cyan-400 w-1 rounded-xs animate-visualizer-bar-2 h-3"></div>
                  <div className="bg-cyan-400 w-1 rounded-xs animate-visualizer-bar-3 h-1"></div>
                  <div className="bg-cyan-400 w-1 rounded-xs animate-visualizer-bar-4 h-2"></div>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono font-bold tracking-widest">NARRATOR ACTIVE</span>
              </div>
            )}

            {/* Interactive Title Overlay (Scene Indicator) */}
            <div className="absolute top-4 right-4 bg-black/80 border border-zinc-800/80 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest text-zinc-300">
              {activeScene.title}
            </div>

            {/* Play overlay button shown when paused */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={startPlaying}
                  className="absolute z-10 p-6 rounded-full bg-indigo-600/90 hover:bg-indigo-600 border border-indigo-400 text-white shadow-2xl flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                  title="Click to play presentation"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Captions Overlay at the lower area */}
            <AnimatePresence>
              {showCaptions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md border border-zinc-800 p-3 sm:p-4 rounded-xl shadow-lg text-center"
                >
                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-zinc-100 max-w-2xl mx-auto">
                    {activeScene.subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Timeline and Interactive Playback Controls */}
          <div className="bg-zinc-950 border-t border-zinc-900 p-4 space-y-3">
            {/* Progress Bar & Slider */}
            <div className="space-y-1">
              <div className="relative h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-950">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-100"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Playback Buttons Group */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReplay}
                  className="p-2 text-zinc-400 hover:text-white rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {isPlaying ? (
                  <button
                    onClick={pausePlaying}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                    title="Pause"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={startPlaying}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                    title="Play Video"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Intro</span>
                  </button>
                )}

                <button
                  onClick={handleSkipForward}
                  className="p-2 text-zinc-400 hover:text-white rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                  title="Skip 5 Seconds Forward"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Scene Indicator Indicators */}
              <div className="hidden md:flex items-center gap-1">
                {INTRO_SCENES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSceneSelect(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentSceneIdx 
                        ? "w-8 bg-indigo-500" 
                        : "w-3 bg-zinc-800 hover:bg-zinc-700"
                    }`}
                    title={`Go to Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Utility Buttons (Mute, Captions, Maximize) */}
              <div className="flex items-center gap-3">
                {/* Speech Synthesis Mute toggle */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer ${
                    isMuted ? "text-red-400 hover:text-red-300" : "text-zinc-400 hover:text-white"
                  }`}
                  title={isMuted ? "Unmute Synthetic Voice Narrator" : "Mute Synthetic Voice Narrator"}
                >
                  {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
                </button>

                {/* Subtitles captions toggle */}
                <button
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer ${
                    showCaptions ? "text-cyan-400" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Toggle Subtitles"
                >
                  <Captions className="w-4.5 h-4.5" />
                </button>

                <div className="text-[10px] font-mono border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-400 bg-zinc-950 select-none">
                  SCENE {currentSceneIdx + 1} OF 4
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
