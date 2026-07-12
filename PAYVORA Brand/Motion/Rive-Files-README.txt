PAYVORA Motion — Rive (.riv) files
==================================
True .riv binary files must be authored inside the Rive editor (rive.app);
they cannot be produced by a script without effectively redrawing/rebuilding
the artwork inside a new authoring tool, which the brand pipeline rules for
this package forbid without explicit sign-off.

Provided instead, for each of the 5 requested motion concepts:
  - a lightweight Lottie JSON (real, working animation, embeds the untouched
    source PNG - opens in any Lottie player)
  - GIF and MP4 preview renders (for Logo Reveal and Loading Animation)

To produce true .riv files: import the transparent logo/icon PNGs from
Logos/ into the Rive editor as image assets and animate them there; the
pixels themselves must not be redrawn, only positioned/animated, consistent
with this package's assets.
