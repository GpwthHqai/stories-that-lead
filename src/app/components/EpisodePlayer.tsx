'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface EpisodePlayerProps {
  audioUrl: string;
  artworkUrl: string;
  episodeNumber: number;
  title: string;
  guestName?: string;
  guestTitle?: string;
  duration: string;
  publishDate: string;
  appleUrl?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  amazonUrl?: string;
}

const SPEEDS = [1, 1.25, 1.5, 1.75, 2, 0.75];

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function EpisodePlayer({
  audioUrl,
  artworkUrl,
  episodeNumber,
  title,
  guestName,
  guestTitle,
  duration,
  publishDate,
  appleUrl,
  spotifyUrl,
  youtubeUrl,
  amazonUrl,
}: EpisodePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setAudioDuration(audio.duration);
      setIsLoaded(true);
    };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, audio.duration || 0));
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * (audio.duration || 0);
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const cycleSpeed = useCallback(() => {
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next];
  }, [speedIndex]);

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const platforms = [
    { label: 'Apple Podcasts', url: appleUrl },
    { label: 'Spotify', url: spotifyUrl },
    { label: 'YouTube', url: youtubeUrl },
    { label: 'Amazon Music', url: amazonUrl },
  ];

  return (
    <div className="bg-navy rounded-2xl border border-gold/20 shadow-2xl overflow-hidden">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Top section: artwork + metadata */}
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
        {/* Artwork */}
        <div className="shrink-0">
          <img
            src={artworkUrl}
            alt={`${title} cover art`}
            className="w-[72px] h-[72px] sm:w-24 sm:h-24 rounded-lg object-cover border-2 border-gold/30"
          />
        </div>

        {/* Metadata */}
        <div className="min-w-0">
          <span className="text-gold text-xs font-bold tracking-widest uppercase font-mono">
            Episode {episodeNumber}
          </span>
          <h2
            className="text-2xl sm:text-[28px] font-bold text-white mt-1 leading-tight"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {title}
          </h2>
          {guestName && (
            <p className="text-gray-400 text-sm mt-2">
              with <span className="text-white">{guestName}</span>
              {guestTitle && <span className="text-gray-500"> / {guestTitle}</span>}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-mono">
            <span>{duration}</span>
            <span className="text-navy-light">|</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Player controls section */}
      <div className="bg-navy-light px-6 sm:px-8 py-5">
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="group relative h-2 bg-navy-dark rounded-full cursor-pointer mb-4"
          onClick={handleSeek}
        >
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-gold rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 7px)` }}
          />
        </div>

        {/* Time display */}
        <div className="flex justify-between text-xs text-gray-500 font-mono mb-4">
          <span>{formatTime(currentTime)}</span>
          <span>{isLoaded ? formatTime(audioDuration) : '--:--'}</span>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {/* Skip back 15s */}
          <button
            onClick={() => skip(-15)}
            className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
            aria-label="Skip back 15 seconds"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            <span className="text-[9px] font-mono mt-0.5">15s</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gold flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-navy-dark">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-navy-dark ml-1">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          {/* Skip forward 30s */}
          <button
            onClick={() => skip(30)}
            className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
            aria-label="Skip forward 30 seconds"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
            </svg>
            <span className="text-[9px] font-mono mt-0.5">30s</span>
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-navy hidden sm:block" />

          {/* Speed toggle */}
          <button
            onClick={cycleSpeed}
            className="px-3 py-1.5 rounded-lg bg-navy/50 border border-gold/10 text-xs font-mono text-gray-400 hover:text-gold hover:border-gold/30 transition-colors"
            aria-label={`Playback speed ${SPEEDS[speedIndex]}x`}
          >
            {SPEEDS[speedIndex]}x
          </button>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 accent-gold cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      {/* Platform pills + branding */}
      <div className="px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gold/10">
        <div className="flex flex-wrap gap-2">
          {platforms.map(({ label, url }) => {
            const isPending = !url || url === 'PENDING';
            return isPending ? (
              <span
                key={label}
                className="px-3 py-1.5 rounded-full text-xs bg-navy-light/30 text-gray-600 border border-navy-light/20 cursor-default"
              >
                {label}
              </span>
            ) : (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full text-xs bg-navy-light/30 text-gray-300 border border-navy-light/30 hover:border-gold/50 hover:text-gold transition-colors"
              >
                {label}
              </a>
            );
          })}
        </div>
        <span className="text-[10px] text-gray-600 font-mono tracking-wider">
          Stories That Lead | storiesthatlead.co
        </span>
      </div>
    </div>
  );
}
