export function GardenBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="garden-bg-washes absolute inset-0" />
      <div className="garden-bg-ground absolute inset-0" />
      <div className="garden-bg-noise absolute inset-0" />
      <div className="garden-bg-dots absolute inset-0" />
      <div className="garden-bg-particles absolute inset-0" />

      {/* Garden bed decorations */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1200 220"
        preserveAspectRatio="none"
        style={{ height: "22%" }}
        role="none"
      >
        {/* Soil/earth mound — organic curve */}
        <path
          d="M0 180 C100 140, 200 155, 300 145 S500 130, 600 140 S800 155, 900 138 S1100 150, 1200 160 L1200 220 L0 220Z"
          fill="#c4a882"
          opacity="0.20"
        />
        <path
          d="M0 190 C150 165, 250 170, 400 162 S600 155, 750 165 S950 170, 1100 158 L1200 170 L1200 220 L0 220Z"
          fill="#a07850"
          opacity="0.15"
        />

        {/* Grass blades — scattered along the bottom */}
        <g opacity="0.30" fill="none" stroke="#6b8e23" strokeWidth="1.5" strokeLinecap="round">
          <path d="M40 180 Q38 155, 45 135" />
          <path d="M48 182 Q52 158, 42 130" />
          <path d="M55 180 Q55 150, 60 128" />
          <path d="M120 175 Q115 148, 125 125" />
          <path d="M128 178 Q132 150, 122 120" />
          <path d="M135 176 Q138 145, 140 118" />
          <path d="M230 170 Q225 140, 235 115" />
          <path d="M238 172 Q243 145, 232 110" />
          <path d="M245 170 Q248 138, 250 108" />
          <path d="M350 168 Q345 138, 355 112" />
          <path d="M358 170 Q363 140, 350 105" />
          <path d="M365 168 Q368 135, 370 100" />
          <path d="M470 172 Q465 142, 478 115" />
          <path d="M478 174 Q483 145, 470 108" />
          <path d="M485 172 Q488 138, 492 105" />
          <path d="M590 168 Q585 138, 598 110" />
          <path d="M598 170 Q603 140, 590 102" />
          <path d="M605 168 Q608 135, 612 100" />
          <path d="M710 174 Q705 144, 718 118" />
          <path d="M718 176 Q723 148, 710 112" />
          <path d="M725 174 Q728 140, 730 108" />
          <path d="M830 170 Q825 138, 838 112" />
          <path d="M838 172 Q843 142, 830 105" />
          <path d="M845 170 Q848 136, 850 102" />
          <path d="M950 175 Q945 145, 958 120" />
          <path d="M958 177 Q963 148, 950 115" />
          <path d="M965 175 Q968 142, 970 112" />
          <path d="M1070 172 Q1065 142, 1078 115" />
          <path d="M1078 174 Q1083 145, 1070 108" />
          <path d="M1085 172 Q1088 138, 1090 105" />
          <path d="M1160 178 Q1155 150, 1168 125" />
          <path d="M1168 180 Q1173 152, 1160 120" />
        </g>

        {/* Lighter grass behind */}
        <g opacity="0.20" fill="none" stroke="#8fb339" strokeWidth="1" strokeLinecap="round">
          <path d="M80 185 Q75 160, 85 140" />
          <path d="M180 178 Q175 152, 188 132" />
          <path d="M290 174 Q285 148, 298 128" />
          <path d="M420 176 Q415 150, 428 130" />
          <path d="M540 172 Q535 146, 548 126" />
          <path d="M660 178 Q655 152, 668 132" />
          <path d="M780 174 Q775 148, 788 128" />
          <path d="M900 180 Q895 154, 908 134" />
          <path d="M1020 176 Q1015 150, 1028 130" />
          <path d="M1130 180 Q1125 155, 1138 135" />
        </g>

        {/* Small wildflowers */}
        <g className="garden-flowers">
          {/* Daisy-like flowers */}
          <g transform="translate(90, 148)" opacity="0.45">
            <circle r="3" fill="#d4a373" />
            <circle r="1.2" fill="#e4c9a8" />
          </g>
          <g transform="translate(260, 138)" opacity="0.38">
            <circle r="2.5" fill="#6b8e23" />
            <circle r="1" fill="#8fb339" />
          </g>
          <g transform="translate(390, 142)" opacity="0.45">
            <circle r="3.5" fill="#d4a373" />
            <circle r="1.4" fill="#f9f7f2" />
          </g>
          <g transform="translate(520, 135)" opacity="0.35">
            <circle r="2.8" fill="#c97b5a" />
            <circle r="1.1" fill="#e4c9a8" />
          </g>
          <g transform="translate(680, 140)" opacity="0.42">
            <circle r="3" fill="#8fb339" />
            <circle r="1.2" fill="#f9f7f2" />
          </g>
          <g transform="translate(810, 132)" opacity="0.38">
            <circle r="3.2" fill="#d4a373" />
            <circle r="1.3" fill="#e4c9a8" />
          </g>
          <g transform="translate(970, 138)" opacity="0.45">
            <circle r="2.6" fill="#6b8e23" />
            <circle r="1" fill="#8fb339" />
          </g>
          <g transform="translate(1110, 145)" opacity="0.35">
            <circle r="3" fill="#c97b5a" />
            <circle r="1.2" fill="#f9f7f2" />
          </g>
        </g>

        {/* Pebbles / stepping stones */}
        <g opacity="0.15">
          <ellipse cx="170" cy="195" rx="12" ry="6" fill="#8a7d6b" transform="rotate(-8 170 195)" />
          <ellipse cx="410" cy="200" rx="9" ry="5" fill="#9a8d7b" transform="rotate(5 410 200)" />
          <ellipse
            cx="620"
            cy="198"
            rx="14"
            ry="7"
            fill="#7a6d5b"
            transform="rotate(-12 620 198)"
          />
          <ellipse
            cx="860"
            cy="195"
            rx="10"
            ry="5.5"
            fill="#8a7d6b"
            transform="rotate(8 860 195)"
          />
          <ellipse
            cx="1050"
            cy="200"
            rx="11"
            ry="6"
            fill="#9a8d7b"
            transform="rotate(-5 1050 200)"
          />
        </g>
      </svg>

      {/* Corner vine — bottom left */}
      <svg
        className="garden-vine-left absolute bottom-0 left-0"
        width="180"
        height="240"
        viewBox="0 0 180 240"
        style={{ opacity: 0.25 }}
        role="none"
      >
        <g fill="none" stroke="#6b8e23" strokeWidth="1.5" strokeLinecap="round">
          <path d="M0 240 C10 200, 25 180, 20 150 S30 110, 45 90 S55 60, 50 40" />
          <path d="M0 220 C15 190, 30 170, 35 145 S50 120, 55 100" />
        </g>
        {/* Leaves on vine */}
        <g fill="#6b8e23" opacity="0.6">
          <ellipse cx="22" cy="155" rx="8" ry="4" transform="rotate(-30 22 155)" />
          <ellipse cx="40" cy="100" rx="7" ry="3.5" transform="rotate(25 40 100)" />
          <ellipse cx="48" cy="55" rx="6" ry="3" transform="rotate(-20 48 55)" />
          <ellipse cx="30" cy="175" rx="6" ry="3" transform="rotate(35 30 175)" />
          <ellipse cx="52" cy="115" rx="5" ry="2.5" transform="rotate(-15 52 115)" />
        </g>
        {/* Small curling tendrils */}
        <g fill="none" stroke="#8fb339" strokeWidth="0.8" opacity="0.5">
          <path d="M45 90 C50 85, 55 82, 52 75 Q48 68, 55 62" />
          <path d="M35 145 C40 140, 48 138, 45 130" />
        </g>
      </svg>

      {/* Corner vine — bottom right */}
      <svg
        className="garden-vine-right absolute bottom-0 right-0"
        width="180"
        height="240"
        viewBox="0 0 180 240"
        style={{ opacity: 0.25 }}
        role="none"
      >
        <g fill="none" stroke="#6b8e23" strokeWidth="1.5" strokeLinecap="round">
          <path d="M180 240 C170 200, 155 180, 160 150 S150 110, 135 90 S125 60, 130 40" />
          <path d="M180 220 C165 190, 150 170, 145 145 S130 120, 125 100" />
        </g>
        <g fill="#6b8e23" opacity="0.6">
          <ellipse cx="158" cy="155" rx="8" ry="4" transform="rotate(30 158 155)" />
          <ellipse cx="140" cy="100" rx="7" ry="3.5" transform="rotate(-25 140 100)" />
          <ellipse cx="132" cy="55" rx="6" ry="3" transform="rotate(20 132 55)" />
          <ellipse cx="150" cy="175" rx="6" ry="3" transform="rotate(-35 150 175)" />
          <ellipse cx="128" cy="115" rx="5" ry="2.5" transform="rotate(15 128 115)" />
        </g>
        <g fill="none" stroke="#8fb339" strokeWidth="0.8" opacity="0.5">
          <path d="M135 90 C130 85, 125 82, 128 75 Q132 68, 125 62" />
          <path d="M145 145 C140 140, 132 138, 135 130" />
        </g>
      </svg>

      {/* Scattered leaf shapes — top area, very subtle */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        role="none"
      >
        <g opacity="0.12" fill="#6b8e23">
          <ellipse cx="100" cy="60" rx="12" ry="5" transform="rotate(-40 100 60)" />
          <ellipse cx="350" cy="90" rx="10" ry="4" transform="rotate(30 350 90)" />
          <ellipse cx="750" cy="50" rx="11" ry="4.5" transform="rotate(-25 750 50)" />
          <ellipse cx="1050" cy="80" rx="9" ry="3.5" transform="rotate(45 1050 80)" />
          <ellipse cx="200" cy="300" rx="8" ry="3" transform="rotate(-55 200 300)" />
          <ellipse cx="1000" cy="350" rx="10" ry="4" transform="rotate(35 1000 350)" />
          <ellipse cx="550" cy="250" rx="7" ry="3" transform="rotate(-20 550 250)" />
        </g>
        {/* Tiny seed/petal shapes drifting */}
        <g opacity="0.10" fill="#d4a373">
          <circle cx="180" cy="180" r="2" />
          <circle cx="480" cy="120" r="1.5" />
          <circle cx="820" cy="200" r="2.5" />
          <circle cx="1100" cy="150" r="1.8" />
          <circle cx="650" cy="380" r="2" />
          <circle cx="300" cy="420" r="1.5" />
          <circle cx="900" cy="450" r="2.2" />
        </g>
      </svg>
    </div>
  );
}
