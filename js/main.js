/* ═══════════════════════════════════════
   THÈME : AUBE — Rose doré, aurore
   ═══════════════════════════════════════ */

[data-theme="aube"] {
  /* Backgrounds */
  --bg-base:       #110b0d;
  --nav-bg:        rgba(17, 11, 13, 0.92);
  --card-bg:       #180e12;
  --card-hover:    #1e1217;
  --hover-bg:      rgba(255,255,255,0.03);

  /* Borders */
  --border:        #2a1820;

  /* Text */
  --text-primary:  #f5e6d3;
  --text-secondary:#c4a882;
  --text-muted:    #6b4a38;

  /* Accent — or rose */
  --accent:        #e8956d;
  --accent-contrast:#110b0d;

  /* Status */
  --status-ok:     #7ecba1;
  --status-warn:   #e8c46d;
  --status-err:    #e87d6d;

  /* Transport badges */
  --badge-tram-bg:  #7ecba1;
  --badge-tram-text:#0a1a12;
  --badge-bus-bg:   #e8956d;
  --badge-bus-text: #110b0d;

  /* Hero FX */
  --glow-a:        rgba(232, 149, 109, 0.12);
  --glow-b:        rgba(232, 196, 109, 0.08);
  --title-gradient: linear-gradient(150deg, #f5e6d3 20%, #e8956d 60%, #e8c46d);
  --grid-pattern:  repeating-linear-gradient(0deg, transparent, transparent 47px, #2a1820 47px, #2a1820 48px),
                   repeating-linear-gradient(90deg, transparent, transparent 47px, #2a1820 47px, #2a1820 48px);

  /* Map filter */
  --map-filter:    invert(0.85) hue-rotate(180deg) saturate(0.5) sepia(0.2);
}
