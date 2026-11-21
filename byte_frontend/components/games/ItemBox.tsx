// ======== //
// Item Box //
// ======== //

"use client";

import React from "react";

// Half the cube's edge length (.item-box-scene is 180px wide in globals.css),
// i.e. how far each face is pushed out from the cube's center.
const HALF_SIZE_PX = 90;

const FACE_TRANSFORMS = [
  `translateZ(${HALF_SIZE_PX}px)`,
  `rotateY(180deg) translateZ(${HALF_SIZE_PX}px)`,
  `rotateY(90deg) translateZ(${HALF_SIZE_PX}px)`,
  `rotateY(-90deg) translateZ(${HALF_SIZE_PX}px)`,
  `rotateX(90deg) translateZ(${HALF_SIZE_PX}px)`,
  `rotateX(-90deg) translateZ(${HALF_SIZE_PX}px)`,
];

interface ItemBoxProps
{
  // Screenshot to show inside the box; the "?" shows when this is omitted.
  imageSrc?: string;
  imageAlt?: string;
  // Turns the cube's edges rainbow and slows its spin once the roulette lands.
  landed?: boolean;
  // Changing this replays the contents' "hit" bump (on Play, and on landing).
  hitKey?: number;
}

// A translucent spinning cube, Mario Kart item-box style. The contents sit at
// the cube's center inside its 3D space — so the front faces genuinely pass
// in front of them — and counter-rotate in lockstep with the cube's spin so
// they always end up facing the viewer.
export default function ItemBox({ imageSrc, imageAlt = "", landed = false, hitKey = 0 }: ItemBoxProps)
{
  return (
    <div className="item-box-scene" data-landed={landed}>
      <div className="item-box-cube">
        {FACE_TRANSFORMS.map((transform) => (
          <div key={transform} className="item-box-face" style={{ transform }} />
        ))}
        {/* Never keyed/remounted: its counter-spin has to stay in phase with
            the cube's spin, which restarting the animation would break. The
            "hit" bump lives on the keyed child instead. */}
        <div className="item-box-core">
          <div key={hitKey} className={hitKey > 0 ? "item-box-hit" : ""}>
            {imageSrc ? (
              // Plain <img>: the roulette swaps these every few dozen ms, and
              // next/image's lazy loading/placeholders would just get in the way.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageSrc} alt={imageAlt} className="block h-[110px] w-[110px] border-2 border-white object-cover" style={{ imageRendering: "pixelated" }} />
            ) : (
              <span className="block text-8xl font-bold leading-none text-white">?</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
