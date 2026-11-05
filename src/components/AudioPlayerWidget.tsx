import React, { useState } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Radio,
} from 'lucide-react';

interface AudioPlayerWidgetProps {
  onToggleVisible?: () => void;
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // YouTube Video ID from https://youtu.be/ki8XqtsPslo
  const VIDEO_ID = 'ki8XqtsPslo';

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="no-print fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Hidden/Active YouTube Embed */}
      {isPlaying && (
        <div className={`overflow-hidden rounded-2xl shadow-2xl border-2 border-emerald-600 bg-slate-950 mb-3 transition-all duration-300 ${
          isExpanded ? 'w-80 h-48 opacity-100' : 'w-0 h-0 opacity-0 pointer-events-none'
        }`}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&enablejsapi=1&playsinline=1${
              isMuted ? '&mute=1' : ''
            }`}
            title="Lagu Syahdu Teman Kerja Guru MIN 1 Paser"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      )}

      {/* Main Floating Controller Bar */}
      <div className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-xl border border-emerald-600/80 backdrop-blur-md">
        {/* Animated Soundwave / Equalizer or Music Icon */}
        <div className="flex items-center gap-2 mr-1">
          <div
            onClick={handleTogglePlay}
            className={`w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition ${
              isPlaying
                ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse'
                : 'bg-emerald-800 text-emerald-200 hover:bg-emerald-700 hover:text-white'
            }`}
            title={isPlaying ? 'Jeda Musik' : 'Putar Lagu Syahdu'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-slate-950" />
            ) : (
              <Play className="w-4 h-4 fill-emerald-200 ml-0.5" />
            )}
          </div>

          <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>Musik Syahdu</span>
              </span>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3 ml-1">
                  <span className="w-1 bg-amber-400 rounded-full animate-[bounce_1s_infinite_100ms] h-2" />
                  <span className="w-1 bg-amber-300 rounded-full animate-[bounce_1s_infinite_300ms] h-3" />
                  <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_200ms] h-2.5" />
                  <span className="w-1 bg-teal-300 rounded-full animate-[bounce_1s_infinite_400ms] h-1.5" />
                </div>
              )}
            </div>
            <div className="text-[10px] text-emerald-300/80 leading-tight">
              {isPlaying ? 'Sedang Memutar • Teman Kerja Guru' : 'Klik Putar untuk Teman Kerja'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 pl-2 border-l border-emerald-800">
          {isPlaying && (
            <>
              {/* Mute toggle */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/60 rounded-lg transition"
                title={isMuted ? 'Buka Suara' : 'Bisukan Suara'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Expand / Minimize video player */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/60 rounded-lg transition"
                title={isExpanded ? 'Sembunyikan Video' : 'Tampilkan Video'}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </>
          )}

          {/* YouTube source link */}
          <a
            href="https://youtu.be/ki8XqtsPslo?si=tdxMvGRnPdDZnH8m"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-emerald-400 hover:text-amber-300 hover:bg-emerald-800/60 rounded-lg transition"
            title="Buka Video Asli di YouTube"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
