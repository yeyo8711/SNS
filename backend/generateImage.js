const fs = require("fs");
module.exports = saveImage = (domain) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1524.869 1524.869">
  <defs>
    <linearGradient id="c" x1="214" y1="640" x2="1521" y2="640" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#efd57c"/>
      <stop offset=".175" stop-color="#b48230"/>
      <stop offset=".591" stop-color="#fdf2a6"/>
      <stop offset=".817" stop-color="#b48230"/>
      <stop offset="1" stop-color="#efd57c"/>
    </linearGradient>
    <clipPath id="b">
      <text transform="translate(398.695 807.381)" style="fill:none;font-family:MyriadPro-Regular,&quot;Myriad Pro&quot;;font-size:201px;stroke:#fbb03b;stroke-miterlimit:10;stroke-width:2px"><tspan x="0" y="0">${domain}.inu</tspan></text>
    </clipPath>
    <filter id="a" x="-20%" y="-20%" width="100%" height="140%">
      <feGaussianBlur in="SourceAlpha" result="blur" stdDeviation="4"/>
      <feOffset dx="4" dy="4" in="blur" result="offsetBlur"/>
      <feSpecularLighting in="blur" result="specOut" specularExponent="10" surfaceScale="5">
        <fePointLight x="-3000" y="-10000" z="-20000"/>
      </feSpecularLighting>
      <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
      <feComposite in="SourceGraphic" in2="specOut" k2="1" k3="1" operator="arithmetic" result="litPaint"/>
      <feMerge>
        <feMergeNode in="offsetBlur"/>
        <feMergeNode in="litPaint"/>
      </feMerge>
    </filter>
  </defs>
  <g style="filter:url(#a)">
    <g style="clip-path:url(#b)">
      <path style="fill:url(#c)" d="M214 378h1307v524H214z"/>
    </g>
  </g>
</svg>
`;
  fs.writeFile(`./images/${domain}.svg`, svg, (err) => {
    if (err) {
      console.log(err);
    }
  });
};