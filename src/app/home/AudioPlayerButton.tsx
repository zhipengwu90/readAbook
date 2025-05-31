import React, { useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

const AudioPlayerButton = ({ text }: { text: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudio = async () => {
    if (!audioLoaded) {
      setIsDisabled(true); // Disable only when fetching audio
      const response = await fetch("/api/speedAPI", {
        method: "POST",
        body: text,
        headers: { "Content-Type": "text/plain" },
      });
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setAudioLoaded(true);

      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);

      audio.play();
      setIsPlaying(true);

      setTimeout(() => setIsDisabled(false), 1000); // Enable after 1 second
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        // Do NOT disable here
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        // Do NOT disable here
      }
    }
  };

  return (
    <IconButton
      color="primary"
      onClick={handleAudio}
      aria-label={isPlaying ? "Pause" : "Play"}
      className="ml-2"
      disabled={isDisabled}
    >
      {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
    </IconButton>
  );
};

export default AudioPlayerButton;
