import { Book } from "lucide-react";
import islandMap from "@/assets/island-option-2.png";

interface LeftPageContentProps {
  page: "login" | "register" | "forgot";
}

export const LeftPageContent = ({ page }: LeftPageContentProps) => {
  if (page === "login") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-primary">
        <Book className="w-24 h-24 mb-8" strokeWidth={1.5} />
        <h1 className="text-5xl font-bold mb-4">Aspera</h1>
        <p className="text-xl opacity-90 text-center px-8 mb-6">
          Откройте новую страницу в своей жизни вместе с нами
        </p>
        <div className="flex items-center gap-3 opacity-60">
          <div className="h-[1px] w-16 bg-primary"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          <div className="h-[1px] w-16 bg-primary"></div>
        </div>
      </div>
    );
  }

  if (page === "register") {
    return (
      <div className="absolute inset-0 z-10 p-8 flex items-center justify-center opacity-50 text-gray-700">
        <svg viewBox="0 0 600 800" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="dots" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.5" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            
            {/* Top left island - organic curved shape */}
            <path d="M 80 120 Q 90 100 110 95 Q 140 90 155 100 Q 170 95 180 105 Q 190 100 200 110 Q 205 125 200 140 Q 195 160 180 165 Q 160 170 145 165 Q 125 170 110 160 Q 90 155 85 140 Q 75 130 80 120 Z" 
                  fill="url(#dots)" />
            
            {/* Large central island - complex coastline */}
            <path d="M 250 280 Q 260 260 280 255 Q 300 250 320 260 Q 335 255 350 265 Q 370 260 385 275 Q 395 270 410 280 Q 420 295 418 315 Q 425 330 420 350 Q 415 370 405 385 Q 410 400 400 415 Q 385 425 370 420 Q 355 430 340 425 Q 320 435 305 430 Q 285 440 270 430 Q 250 435 240 420 Q 230 405 235 385 Q 225 370 230 350 Q 225 330 235 310 Q 240 295 250 280 Z" 
                  fill="url(#dots)" />
            
            {/* Right island - curved elongated */}
            <path d="M 480 200 Q 490 185 505 183 Q 520 180 530 190 Q 540 185 545 195 Q 550 210 545 230 Q 540 245 530 250 Q 520 260 505 258 Q 490 265 480 255 Q 470 240 475 220 Q 475 210 480 200 Z" 
                  fill="url(#dots)" />
            
            {/* Bottom left small island */}
            <path d="M 120 580 Q 130 570 145 572 Q 160 570 170 582 Q 175 595 168 608 Q 160 620 145 618 Q 130 625 120 612 Q 112 600 120 580 Z" 
                  fill="url(#dots)" />
            
            {/* Bottom right island */}
            <path d="M 450 620 Q 465 605 485 608 Q 505 605 520 618 Q 530 615 538 628 Q 542 645 535 660 Q 525 675 510 678 Q 490 685 475 680 Q 455 688 445 673 Q 438 655 445 640 Q 445 630 450 620 Z" 
                  fill="url(#dots)" />
            
            {/* Middle right small island */}
            <path d="M 520 450 Q 530 440 545 442 Q 560 445 565 458 Q 568 475 560 488 Q 550 498 535 495 Q 520 500 515 485 Q 512 468 520 450 Z" 
                  fill="url(#dots)" />
            
            {/* Waves - scattered throughout */}
            <path d="M 150 220 Q 155 215 160 220 Q 165 215 170 220" strokeWidth="1.5" />
            <path d="M 180 240 Q 185 235 190 240 Q 195 235 200 240" strokeWidth="1.5" />
            <path d="M 210 200 Q 215 195 220 200 Q 225 195 230 200" strokeWidth="1.5" />
            <path d="M 420 220 Q 425 215 430 220 Q 435 215 440 220" strokeWidth="1.5" />
            <path d="M 440 250 Q 445 245 450 250 Q 455 245 460 250" strokeWidth="1.5" />
            <path d="M 200 500 Q 205 495 210 500 Q 215 495 220 500" strokeWidth="1.5" />
            <path d="M 230 520 Q 235 515 240 520 Q 245 515 250 520" strokeWidth="1.5" />
            <path d="M 350 550 Q 355 545 360 550 Q 365 545 370 550" strokeWidth="1.5" />
            <path d="M 380 570 Q 385 565 390 570 Q 395 565 400 570" strokeWidth="1.5" />
            <path d="M 300 180 Q 305 175 310 180 Q 315 175 320 180" strokeWidth="1.5" />
            <path d="M 100 350 Q 105 345 110 350 Q 115 345 120 350" strokeWidth="1.5" />
            <path d="M 130 380 Q 135 375 140 380 Q 145 375 150 380" strokeWidth="1.5" />
            <path d="M 480 380 Q 485 375 490 380 Q 495 375 500 380" strokeWidth="1.5" />
            <path d="M 500 420 Q 505 415 510 420 Q 515 415 520 420" strokeWidth="1.5" />
            <path d="M 320 650 Q 325 645 330 650 Q 335 645 340 650" strokeWidth="1.5" />
            <path d="M 280 680 Q 285 675 290 680 Q 295 675 300 680" strokeWidth="1.5" />
            
            {/* Ships - multiple sailing vessels */}
            {/* Ship 1 - top area */}
            <g transform="translate(260, 180)">
              <path d="M 0 0 L -8 12 L 8 12 Z" fill="currentColor" opacity="0.4" />
              <line x1="0" y1="0" x2="0" y2="12" strokeWidth="1.5" />
              <path d="M -10 12 L 10 12 L 8 16 L -8 16 Z" fill="currentColor" opacity="0.3" />
            </g>
            
            {/* Ship 2 - right side */}
            <g transform="translate(420, 350) scale(1.2)">
              <path d="M 0 0 L -8 12 L 8 12 Z" fill="currentColor" opacity="0.4" />
              <line x1="0" y1="0" x2="0" y2="12" strokeWidth="1.5" />
              <path d="M -10 12 L 10 12 L 8 16 L -8 16 Z" fill="currentColor" opacity="0.3" />
            </g>
            
            {/* Ship 3 - bottom area */}
            <g transform="translate(300, 560)">
              <path d="M 0 0 L -8 12 L 8 12 Z" fill="currentColor" opacity="0.4" />
              <line x1="0" y1="0" x2="0" y2="12" strokeWidth="1.5" />
              <path d="M -10 12 L 10 12 L 8 16 L -8 16 Z" fill="currentColor" opacity="0.3" />
            </g>
            
            {/* Ship 4 - left area */}
            <g transform="translate(180, 420) scale(0.9)">
              <path d="M 0 0 L -8 12 L 8 12 Z" fill="currentColor" opacity="0.4" />
              <line x1="0" y1="0" x2="0" y2="12" strokeWidth="1.5" />
              <path d="M -10 12 L 10 12 L 8 16 L -8 16 Z" fill="currentColor" opacity="0.3" />
            </g>
            
            {/* Ship 5 - top right */}
            <g transform="translate(460, 280) scale(0.85)">
              <path d="M 0 0 L -8 12 L 8 12 Z" fill="currentColor" opacity="0.4" />
              <line x1="0" y1="0" x2="0" y2="12" strokeWidth="1.5" />
              <path d="M -10 12 L 10 12 L 8 16 L -8 16 Z" fill="currentColor" opacity="0.3" />
            </g>
            
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-10 p-12 flex items-center justify-center opacity-40 text-gray-700">
      <svg viewBox="0 0 500 700" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="planetGlow">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round">
          {/* Top planet with rings */}
          <circle cx="150" cy="140" r="45" strokeWidth="2.5" />
          <ellipse cx="150" cy="140" rx="65" ry="15" transform="rotate(-20 150 140)" strokeWidth="2" />
          <ellipse cx="150" cy="140" rx="75" ry="18" transform="rotate(-20 150 140)" strokeWidth="1.5" opacity="0.6" />
          <circle cx="135" cy="125" r="10" opacity="0.4" />
          <circle cx="160" cy="150" r="7" opacity="0.5" />
          <circle cx="145" cy="155" r="5" opacity="0.3" />
          <circle cx="150" cy="140" r="80" fill="url(#planetGlow)" stroke="none" />
          
          {/* Large central planet */}
          <circle cx="280" cy="320" r="70" strokeWidth="3" />
          <ellipse cx="280" cy="320" rx="95" ry="22" transform="rotate(25 280 320)" strokeWidth="2.5" />
          <circle cx="255" cy="295" r="15" opacity="0.4" />
          <circle cx="295" cy="335" r="12" opacity="0.35" />
          <circle cx="270" cy="345" r="9" opacity="0.45" />
          <circle cx="305" cy="310" r="7" opacity="0.3" />
          <circle cx="260" cy="310" r="6" opacity="0.4" />
          <circle cx="280" cy="320" r="100" fill="url(#planetGlow)" stroke="none" />
          
          {/* Bottom right planet */}
          <circle cx="380" cy="550" r="50" strokeWidth="2.5" />
          <ellipse cx="380" cy="550" rx="70" ry="16" transform="rotate(-10 380 550)" strokeWidth="2" opacity="0.8" />
          <circle cx="365" cy="535" r="11" opacity="0.4" />
          <circle cx="395" cy="560" r="8" opacity="0.35" />
          <circle cx="375" cy="570" r="6" opacity="0.45" />
          <circle cx="380" cy="550" r="75" fill="url(#planetGlow)" stroke="none" />
          
          {/* Small moon bottom left */}
          <circle cx="120" cy="520" r="28" strokeWidth="2" />
          <circle cx="110" cy="512" r="6" opacity="0.4" />
          <circle cx="128" cy="528" r="4" opacity="0.5" />
          
          {/* Tiny satellite top right */}
          <circle cx="420" cy="150" r="18" strokeWidth="1.5" />
          <circle cx="415" cy="145" r="4" opacity="0.4" />
          
          {/* Orbital paths with dots */}
          <ellipse cx="250" cy="250" rx="150" ry="280" transform="rotate(20 250 250)" strokeDasharray="2,8" opacity="0.25" strokeWidth="1" />
          <ellipse cx="280" cy="320" rx="200" ry="180" transform="rotate(-15 280 320)" strokeDasharray="2,8" opacity="0.25" strokeWidth="1" />
          
          {/* Connecting paths */}
          <path d="M 180 160 Q 220 230 250 290" strokeDasharray="3,6" opacity="0.35" strokeWidth="1" />
          <path d="M 340 360 Q 360 450 370 520" strokeDasharray="3,6" opacity="0.35" strokeWidth="1" />
          <path d="M 245 370 Q 185 440 140 510" strokeDasharray="3,6" opacity="0.35" strokeWidth="1" />
          
          {/* Stars */}
          <circle cx="80" cy="90" r="3" fill="currentColor" />
          <circle cx="450" cy="180" r="2.5" fill="currentColor" />
          <circle cx="200" cy="240" r="2" fill="currentColor" />
          <circle cx="460" cy="400" r="3" fill="currentColor" />
          <circle cx="90" cy="450" r="2.5" fill="currentColor" />
          <circle cx="320" cy="600" r="2" fill="currentColor" />
          <circle cx="180" cy="80" r="2" fill="currentColor" />
          <circle cx="400" cy="260" r="2.5" fill="currentColor" />
          <circle cx="50" cy="300" r="2" fill="currentColor" />
          <circle cx="430" cy="520" r="2" fill="currentColor" />
          
          {/* Star constellation */}
          <line x1="80" y1="90" x2="95" y2="105" strokeWidth="0.5" opacity="0.3" />
          <line x1="95" y1="105" x2="110" y2="100" strokeWidth="0.5" opacity="0.3" />
          <line x1="110" y1="100" x2="120" y2="115" strokeWidth="0.5" opacity="0.3" />
          <circle cx="95" cy="105" r="2" fill="currentColor" />
          <circle cx="110" cy="100" r="1.5" fill="currentColor" />
          <circle cx="120" cy="115" r="2" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
};
