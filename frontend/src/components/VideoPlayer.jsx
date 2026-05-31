import { useEffect, useRef } from "react";

export default function VideoPlayer({
  stream,
  muted = false,
}) {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className="w-full h-full rounded-2xl object-cover bg-black"
    />
  );
}