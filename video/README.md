# Chrysa launch film

A 23-second launch film for Chrysa with the mascot. The animation is code, so the copy, colours and timing can be changed and the film rendered again.

| File | What it is |
| --- | --- |
| `launch.html` | The whole animation. Open it in a browser for a live preview, or render it frame by frame. |
| `chrysa-cut.png` | The mascot with its baked floor shadow turned into a translucent shadow. |
| `render.js` | Renders the animation with Playwright. |
| `soundtrack.py` | An original synthesised score with sound effects, timed to the cuts. |
| `chrysa-launch-4k.mp4` | The finished 3840 x 2160 film. |
| `chrysa-launch-1080p.mp4` | A lighter 1080p copy for social and messaging. |

## Rebuild

```bash
node render.js frames 30 2 0 23.06          # 690 frames at 3840x2160
python3 soundtrack.py soundtrack.wav
ffmpeg -framerate 30 -i frames/f%04d.png -i soundtrack.wav \
  -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k \
  -shortest -movflags +faststart chrysa-launch-4k.mp4
```

## Running order

| Time | Beat |
| --- | --- |
| 0.0 | "Introducing Chrysa for brands." The mascot appears. |
| 1.9 | "Chrysa finds the" cycles through customers, conversations and reviews, then lands on moments |
| 3.1 | "worth ✓ your voice." |
| 3.9 | Dark panel: "Written in your voice." |
| 4.7 | Scrolling cards of real signals: "Heard. Sorted. Drafted." |
| 6.6 | Gold panel: "Sent with 1 tap." The panel shrinks into a phone. |
| 8.0 | Chat with Chrysa, with the steps listed beside it: Listen, Brief, Draft, Approve, Measure. Confetti plays on "Done". |
| 16.0 | Blue panel: "ask Chrysa" about reviews, AI search, creators, your rivals, then "anything." |
| 18.4 | "A marketing mind, yours to keep." The panel shrinks to a card next to "always on." |
| 20.7 | The Chrysa wordmark types itself in, with chrysa.ai underneath |
