import { useState } from 'react';

export function useVideoService() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const toggleAudio = () => setIsMuted((prev) => !prev);
  const toggleVideo = () => setIsVideoOff((prev) => !prev);

  return { isMuted, isVideoOff, toggleAudio, toggleVideo };
}
