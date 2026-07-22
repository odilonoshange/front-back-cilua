export const VideoPlayer = ({ src, poster }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-black">
      <video
        controls
        poster={poster}
        className="w-full max-h-[550px] bg-black"
        src={src}
      >
        Seu navegador não suporta reprodução de vídeo.
      </video>
    </div>
  );
};
