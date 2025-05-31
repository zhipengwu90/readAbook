import React, { useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

interface AudioPlayerButtonProps {
  text: string;
}

const AudioPlayerButton = ({ text }: AudioPlayerButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sendText = async (text: string) => {
    if (isPlaying) {
      // Pause and reset audio
      audioRef.current?.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }
    // Fetch audio from API
    const response = await fetch("/api/speedAPI", {
      method: "POST",
      body: text,
      headers: { "Content-Type": "text/plain" },
    });
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };
    audio.onpause = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };
  };

  return (
    <IconButton
      color="primary"
      onClick={() => sendText(text)}
      aria-label={isPlaying ? "Pause" : "Play"}
      className="ml-2"
    >
      {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
    </IconButton>
  );
};

export default AudioPlayerButton;
