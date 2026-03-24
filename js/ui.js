/* ═══════════════════════════════════════
   THÈME : NUIT — Dark editorial
   ═══════════════════════════════════════ */

[data-theme="nuit"] {
  /* Backgrounds */
  --bg-base:       #080b0f;
  --nav-bg:        rgba(8, 11, 15, 0.92);
  --card-bg:       #0d1117;
  --card-hover:    #111720;
  --hover-bg:      rgba(255,255,255,0.04);

  /* Borders */
  --border:        #1a1f2a;

  /* Text */
  --text-primary:  #e8eaf0;
  --text-secondary:#9da5b4;
  --text-muted:    #454e60;

  /* Accent — bleu électrique froid */
  --accent:        #4f9cf9;
  --accent-contrast:#080b0f;

  /* Status */
  --status-ok:     #3ecf8e;
  --status-warn:   #f6a623;
  --status-err:    #f56565;

  /* Transport badges */
  --badge-tram-bg:  #3ecf8e;
  --badge-tram-text:#08110a;
  --badge-bus-bg:   #4f9cf9;
  --badge-bus-text: #080b0f;

  /* Hero FX */
  --glow-a:        rgba(79, 156, 249, 0.08);
  --glow-b:        rgba(62, 207, 142, 0.05);
  --title-gradient: linear-gradient(150deg, #e8eaf0 30%, #4f9cf9);
  --grid-pattern:  repeating-linear-gradient(0deg, transparent, transparent 47px, #1a1f2a 47px, #1a1f2a 48px),
                   repeating-linear-gradient(90deg, transparent, transparent 47px, #1a1f2a 47px, #1a1f2a 48px);

  /* Map filter — dark inversion */
  --map-filter:    invert(0.9) hue-rotate(180deg) saturate(0.6);
}
