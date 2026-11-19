# Chrysa launch film

A 19-second launch film for Chrysa with the mascot. The animation is code, so the copy, colours and timing can be changed and the film rendered again.

| File | What it is |
| --- | --- |
| `launch.html` | The whole animation. Open it in a browser for a live preview, or render it frame by frame. |
| `chrysa-cut.png` | The mascot with its baked floor shadow turned into a translucent shadow. |
| `render.js` | Renders the animation with Playwright. |
| `soundtrack.py` | An original synthesised score with sound effects, timed to the cuts. |
| `chrysa-launch-4k.mp4` | The finished 3840 x 2160 film. |
| `chrysa-launch-1080p.mp4` | A lighter 1080p copy for social and messaging. |
| `chrysa-launch-9x16.mp4` | The 1080 x 1920 vertical cut for Reels, TikTok and Shorts. |

## Rebuild

```bash
node render.js frames 30 2 0 19.0           # 570 frames at 3840x2160
python3 soundtrack.py soundtrack.wav
ffmpeg -framerate 30 -i frames/f%04d.png -i soundtrack.wav \
  -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k \
  -shortest -movflags +faststart chrysa-launch-4k.mp4

# 9:16 vertical (open launch.html?v for a live preview)
node render.js vframes 30 1 0 19.0 v         # 1080x1920
ffmpeg -framerate 30 -i vframes/f%04d.png -i soundtrack.wav \
  -c:v libx264 -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -shortest -movflags +faststart chrysa-launch-9x16.mp4
```

The vertical version is laid out at 864 x 1536 and rendered at 1.25x, so its type is a quarter larger relative to the frame and reads well on a phone. Every scene keeps to the centre of the frame, clear of the areas that Reels and TikTok cover with their own buttons and captions.

## Running order

| Time | Beat |
| --- | --- |
| 0.0 | "Introducing Chrysa for brands." The mascot appears. |
| 1.9 | "Chrysa finds the" cycles through customers, conversations and reviews, then lands on moments |
| 3.1 | "worth ✓ your voice." |
| 3.9 | Dark panel: "Written in your voice." |
| 4.7 | Scrolling cards of real signals: "Heard. Sorted. Drafted." |
| 6.6 | Gold panel: "Sent with 1 tap." |
| 7.8 | Listen, Brief, Draft, Approve, Measure appear large and centred, one after another |
| 10.2 | A counter climbs to "4 of 6", above "Top answers now name you.", with confetti |
| 12.0 | Blue panel: "ask Chrysa" about reviews, search, creators, your rivals, then "anything." |
| 14.35 | "A marketing mind, yours to keep." The panel shrinks to a card next to "always on." |
| 16.65 | The Chrysa wordmark types itself in, with chrysa.ai underneath |

The phone and chat scene from the first cut is still in `launch.html` but switched off (`phVis=false`).

## The series

The launch film opens a three-part series. Each film hands over to the next.

| # | Film | Job | Ends on |
| --- | --- | --- | --- |
| 1 | `launch.html`: "Introducing Chrysa for brands." | Introduce her | "always on." and the wordmark |
| 2 | `film2.html`: "Your morning, already sorted." | Show the daily habit | "Next: are you found where people ask?" |
| 3 | `film3.html`: "Be found where people ask." | Show the proof, then ask | "Your first reading is free." |

Films 2 and 3 share `film.css` and `film.js`, which hold the colours, timing helpers, panel wipes, confetti and closing card. Their scores come from the same motif, so the three sound like one family.

```bash
FILM=film2.html node render.js frames2 30 2 0 16.2       # 16:9 in 4K
FILM=film2.html node render.js vframes2 30 1 0 16.2 v    # 9:16
python3 soundtrack.py soundtrack2.wav film2
# film 3: FILM=film3.html, 16.1 seconds, soundtrack.py ... film3
```

### Film 2: "Your morning, already sorted." (16s)

| Time | Beat |
| --- | --- |
| 0.0 | The clock rolls from 6:58 to 7:00. "Before your first coffee," |
| 2.2 | Dark panel: 47 new comments, 12 reviews, 9 messages, 3 searches you're missing. "Where do you even start?" |
| 4.4 | The mascot appears: "Good morning, Leila. 5 moments need you." |
| 5.9 | A deck of five moment cards. Each is approved with one tap and flies away while the counter drops to zero. |
| 11.1 | "All caught up." with confetti, then "Five moments. Four minutes. Your voice." |
| 12.6 | Gold panel: "Your morning, already sorted." |
| 14.15 | Wordmark, then "Next: are you found where people ask?" |

### Film 3: "Be found where people ask." (16s)

| Time | Beat |
| --- | --- |
| 0.0 | "Right now, someone is asking:" while "best café near Marina" types into a search bar |
| 2.75 | "6 places answered. None of them named you." Six tiles show ChatGPT, Google, Perplexity, Gemini, Maps and Copilot, each marked "Leaves you out". |
| 4.95 | Dark panel: "If they don't name you, they can't choose you." |
| 6.55 | "Chrysa found out why." Three fixes resolve one by one: Fixed, Page drafted, Replied. |
| 10.0 | The tiles flip one at a time to "Names you", reaching "4 of 6 now name you." with confetti, then "Two to go. She's on it." |
| 12.55 | Blue panel: "Be found where people ask." |
| 14.05 | Wordmark, then "Your first reading is free." |

### Film 4: "The Pearl" (19s)

A more cinematic, standalone piece built around the mascot's own shape: a shell turns grit into a pearl, and Chrysa turns noise into the one moment that matters. It drops the interface cards in favour of metaphor, so it works as a brand film or as the top-of-funnel opener for the series.

| Time | Beat |
| --- | --- |
| 0.0 | A dark sea of drifting comments, with distant ones out of focus. One golden line hides among them. "Every day, people say thousands of things about you." |
| 2.9 | The crowd thickens and speeds up. "Most of it is noise." |
| 4.8 | The shell descends, glowing, and draws every comment in on a slow spiral. "Chrysa listens to all of it." |
| 8.2 | The last voice, the golden one, goes in. Silence. "And finds the one that matters." |
| 9.8 | A pearl rises from the shell. |
| 11.0 | The moment itself: "Quiet brunch spot for a first date?" at 94% intent, with a reply drafted in your voice. "Someone wants exactly what you offer." |
| 14.15 | The pearl blooms into the cream world of the brand. "In all the noise, she finds the pearl." |
| 16.75 | Wordmark, then "A marketing mind you can keep." |

The score swaps the series beat for an underwater drone and murmuring chatter that builds, then is drawn into a swell. A beat of silence follows, a bell rings for the pearl, and the series motif blooms in at the end.
