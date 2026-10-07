type GooeyBlobProps = { id: string; className?: string };

export function GooeyBlob({ id, className = '' }: GooeyBlobProps) {
  const filterId = `${id}-filter`;
  return (
    <svg className={`gooey-art ${className}`} viewBox="0 0 240 180" aria-hidden="true" focusable="false">
      <defs>
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="8" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" result="wobble" />
          <feGaussianBlur in="wobble" stdDeviation="5" result="soft" />
          <feColorMatrix in="soft" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <circle className="gooey-orb gooey-orb--main" cx="101" cy="88" r="46" fill="#ff5e13" />
        <circle className="gooey-orb gooey-orb--satellite" cx="148" cy="94" r="25" fill="#fdae5c" />
        <circle className="gooey-orb gooey-orb--small" cx="63" cy="112" r="17" fill="#001d38" />
      </g>
    </svg>
  );
}
