# Happy Birthday Website

An elegant, responsive birthday wishes website with confetti, music toggle, and a lightbox photo gallery.

## Quick Start

1. Place your images inside `assets/images`.
2. Open `script.js` and list the image file names in `imageFileNames`:

```js
const imageFileNames = [
  'photo1.jpg', 'photo2.jpg', 'photo3.jpg'
];
```

3. (Optional) Put a music file at `assets/audio/music.mp3`.
4. Open `index.html` in your browser.

## Customize

- Change the celebrant name in `index.html` by editing the `#celebrant-name` span.
- Tweak colors, spacing, and animations in `styles.css` by adjusting CSS variables at the top.
- Replace or add images anytime; update `imageFileNames` accordingly.

## Notes

- All features work without any build step or external libraries.
- If autoplay is blocked, click the Music button to start audio.

