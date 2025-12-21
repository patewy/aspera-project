export const LightRays = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ray1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.15)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)', stopOpacity: 0 }} />
          </linearGradient>
          <linearGradient id="ray2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.1)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)', stopOpacity: 0 }} />
          </linearGradient>
          <linearGradient id="ray3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.08)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        
        {/* Light rays */}
        <polygon
          points="200,-50 250,-50 400,800 300,800"
          fill="url(#ray1)"
          opacity="0.6"
        />
        <polygon
          points="500,-50 600,-50 800,800 650,800"
          fill="url(#ray2)"
          opacity="0.5"
        />
        <polygon
          points="800,-50 900,-50 1100,800 950,800"
          fill="url(#ray1)"
          opacity="0.4"
        />
        <polygon
          points="1100,-50 1200,-50 1350,800 1200,800"
          fill="url(#ray3)"
          opacity="0.5"
        />
        <polygon
          points="50,-50 150,-50 200,800 100,800"
          fill="url(#ray2)"
          opacity="0.3"
        />
        <polygon
          points="1300,-50 1400,-50 1440,800 1340,800"
          fill="url(#ray1)"
          opacity="0.4"
        />
      </svg>
    </div>
  );
};
