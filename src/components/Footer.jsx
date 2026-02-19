import LogoInfo_track from "../assets/LogoInfo_track.png";

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 mb-16 md:mb-0 flex flex-col items-center justify-center gap-1 text-xs text-slate-600 dark:text-slate-400">
        <img src={LogoInfo_track} alt="InfoTrack Logo" className="h-5 w-auto" />
        <span>
          Organizacion potenciada con <strong>InfoTrack</strong>, un producto de{" "}
          <strong>Ludem Software</strong>.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
