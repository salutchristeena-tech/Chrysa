"""Original soundtracks for the Chrysa film series (synthesised, royalty free).

    python3 soundtrack.py out.wav            # film 1, the launch film
    python3 soundtrack.py out.wav film2      # film 2, "Your morning, already sorted."
    python3 soundtrack.py out.wav film3      # film 3, "Be found where people ask."
    python3 soundtrack.py out.wav film4      # film 4, "The Pearl"
    python3 soundtrack.py out.wav film5      # film 5, the playful one
    python3 soundtrack.py out.wav film6      # film 6, "Ask Chrysa"

All three share one motif (an electric-piano arpeggio over a soft pad, 100 BPM) so the
series sounds like one family: film 2 sits a tone higher for the morning, film 3 starts
in a minor key and lifts into film 1's progression when the answers start naming you.
"""
import numpy as np, wave, sys

SR = 48000
FILM = sys.argv[2] if len(sys.argv) > 2 else 'launch'
DUR = {'launch': 19.0, 'film2': 16.2, 'film3': 16.1, 'film4': 18.9, 'film5': 17.4, 'film6': 21.0}[FILM]
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(3)

def t_(d): return np.arange(int(d * SR)) / SR
def add(sig, at, pan=0.0, gain=1.0):
    i = int(at * SR); j = min(N, i + len(sig)); sig = sig[:j - i] * gain
    L[i:j] += sig * np.sqrt((1 - pan) / 2); R[i:j] += sig * np.sqrt((1 + pan) / 2)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def epiano(f, d=1.6):
    t = t_(d); env = np.exp(-t * 2.6) * (1 - np.exp(-t * 400))
    mod = np.sin(2 * np.pi * f * 14 * t) * np.exp(-t * 9) * 0.6
    return (np.sin(2 * np.pi * f * t + mod) + 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 5)) * env
def pad(f, d):
    t = t_(d); env = np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.8)
    return sum(np.sin(2 * np.pi * f * (1 + dt) * t) for dt in (-0.003, 0, 0.004)) / 3 * env
def kick():
    t = t_(0.35); f = 48 + 90 * np.exp(-t * 30); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9)
def hat():
    t = t_(0.06); n = rng.standard_normal(len(t)); n = np.diff(np.r_[0, n]); return n * np.exp(-t * 70) * 0.25
def pop(f=880):
    t = t_(0.14); fr = f * (1 + 0.6 * np.exp(-t * 40)); ph = 2 * np.pi * np.cumsum(fr) / SR
    return np.sin(ph) * np.exp(-t * 34)
def whoosh(d=0.5):
    t = t_(d); n = rng.standard_normal(len(t))
    out = np.zeros_like(n); y = 0
    for i in range(len(n)):                       # one-pole low-pass that opens and closes
        a = 0.02 + 0.25 * np.sin(np.pi * i / len(n)); y += a * (n[i] - y); out[i] = y
    return out * np.sin(np.pi * t / d) ** 2 * 2.2
def chime(f):
    t = t_(2.4); return sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (1.6 + k)) / k for k in (1, 2, 3, 4.2))
def tick():
    t = t_(0.03); return rng.standard_normal(len(t)) * np.exp(-t * 200) * 0.5
def thud():
    return kick() * 1.4

BPM = 100; B = 60 / BPM
F_MAJ = [[53, 57, 60, 64, 67], [57, 60, 64, 67], [50, 57, 60, 64, 65], [46, 53, 57, 62]]   # Fmaj9 Am7 Dm9 Bbmaj7
G_MAJ = [[55, 59, 62, 66, 69], [59, 62, 66, 69], [52, 59, 62, 66, 67], [48, 55, 59, 64]]   # the same, a tone up
A_MIN = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 60, 64], [55, 59, 62, 67]]           # Am7 Fmaj7 C G

def bed(sections, rhythm_from, music_end, start=0.0):
    """Pad, bass pad and eighth-note arpeggio, with kick, hat and bass from rhythm_from."""
    arp_end = music_end - 0.4
    for b in range(int(DUR / (4 * B)) + 1):
        t0 = start + b * 4 * B
        if t0 >= music_end: break
        prog = [p for s, p in sections if s <= t0 + 1e-6][-1]
        ch = prog[b % 4]
        add(pad(hz(ch[0] + 12), 4 * B + 0.4), t0, 0, 0.05)
        add(pad(hz(ch[0] - 12), 4 * B + 0.2), t0, 0, 0.07)
        for k in range(8):
            tt = t0 + k * B / 2
            if tt > arp_end: break
            n = ch[[0, 2, 1, 3, 2, 1, 3, 2][k] % len(ch)] + 12
            add(epiano(hz(n), 1.2), tt, (-0.4 if k % 2 else 0.4), 0.075)
        if t0 >= rhythm_from - 4 * B:
            for k in range(4):
                tt = t0 + k * B
                if rhythm_from <= tt < arp_end:
                    if k in (0, 2): add(kick(), tt, 0, 0.32)
                    add(hat(), tt + B / 2, 0.3, 0.6)
                    add(np.sin(2 * np.pi * hz(ch[0] - 24) * t_(B * 0.9)) * np.exp(-t_(B * 0.9) * 3), tt, 0, 0.12)

def close(at_type, at_chime, root=53):
    """Logo typing ticks, the four-note chime and a final pad."""
    for i in range(6): add(tick(), at_type + i * 0.075, 0, 0.5)
    for f, d in ((hz(77), 0), (hz(81), 0.09), (hz(84), 0.18), (hz(89), 0.3)): add(chime(f), at_chime + d, 0, 0.09)
    add(pad(hz(root), 2.2), at_type + 0.05, 0, 0.06); add(pad(hz(root + 7), 2.2), at_type + 0.05, 0, 0.05)

def sparkle(at, n=22, spread=1.0):
    for i in range(n): add(pop(1800 + rng.random() * 1600) * 0.5, at + rng.random() * spread, rng.uniform(-.8, .8), 0.11)

if FILM == 'launch':
    bed([(0, F_MAJ)], 3.9, 16.95)
    for at in (3.85, 4.7, 6.55, 7.5, 11.95, 14.3, 15.45): add(whoosh(0.5), at, 0.0, 0.16)
    add(pop(660), 0.5, 0, 0.25); add(epiano(hz(84), 2), 0.55, 0, 0.12)
    for at in (2.35, 2.6, 2.85): add(tick(), at, 0.2, 0.4)
    for at in (5.0, 5.55, 6.1): add(pop(520), at, 0, 0.18)
    for i, at in enumerate((7.85, 8.3, 8.75, 9.2, 9.65)): add(epiano(hz((65, 69, 72, 76, 77)[i] + 12), 1.0), at, 0, 0.13)
    for i in range(4): add(tick(), 10.3 + i * 0.12, 0, 0.5)
    add(chime(hz(84)), 10.8, 0, 0.08)
    sparkle(10.8)
    for at in (12.85, 13.15, 13.45, 13.75): add(tick(), at, 0, 0.35)
    close(16.7, 17.2)

elif FILM == 'film2':
    bed([(0, G_MAJ)], 4.35, 14.1)
    add(tick(), 0.55, 0, 0.5); add(tick(), 1.1, 0, 0.5)                       # the clock
    for f, d in ((hz(79), 0), (hz(83), 0.12), (hz(86), 0.24)): add(chime(f), 1.12 + d, 0, 0.07)
    for at in (2.15, 4.25, 12.55, 13.9): add(whoosh(0.5), at, 0, 0.16)
    for a in (2.5, 2.75, 3.0, 3.25):                                           # counters rolling up
        for i in range(5): add(tick(), a + i * 0.08, 0.2, 0.35)
    add(thud(), 3.6, 0, 0.3)
    add(pop(660), 4.45, 0, 0.25); add(epiano(hz(86), 2), 4.5, 0, 0.12)
    add(pop(520), 5.05, 0, 0.18)
    for p in (7.0, 8.45, 9.9, 10.45, 10.8): add(pop(1180), p, 0.3, 0.22)         # buttons
    for f in (7.35, 8.8, 10.25, 10.6, 10.95): add(whoosh(0.3), f, 0.5, 0.12)    # cards flying off
    add(chime(hz(86)), 11.1, 0, 0.08); sparkle(11.2)
    close(14.15, 14.65, root=55)

elif FILM == 'film3':
    bed([(0, A_MIN), (9.6, F_MAJ)], 4.95, 14.0)
    for i in range(21): add(tick(), 0.8 + i * 0.065, 0.1, 0.45)                  # typing the question
    add(pop(880), 2.3, 0, 0.2)
    for i in range(6): add(pop(700), 2.95 + i * 0.09, -0.5 + i * 0.2, 0.12)      # the answers appear
    add(thud(), 3.75, 0, 0.3)
    for at in (4.9, 6.3, 12.5, 13.8): add(whoosh(0.5), at, 0, 0.16)
    add(pop(660), 6.7, 0, 0.22)
    for a in (7.25, 7.85, 8.45): add(tick(), a, 0, 0.4); add(pop(1180), a + 0.6, 0.3, 0.2)
    for i, f in enumerate((10.45, 10.75, 11.05, 11.35)):                        # each answer now names you
        add(epiano(hz((72, 76, 79, 84)[i] + 12), 1.0), f + 0.15, 0, 0.14)
    add(chime(hz(84)), 11.45, 0, 0.08); sparkle(11.45)
    close(14.05, 14.55)

elif FILM == 'film4':
    # the deep: a low detuned drone that breathes
    t = t_(14.6)
    drone = (np.sin(2 * np.pi * 55 * t) + 0.7 * np.sin(2 * np.pi * 55.4 * t) + 0.5 * np.sin(2 * np.pi * 82.4 * t)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.18 * t))
    drone *= np.minimum(1, t / 1.5) * np.minimum(1, (14.6 - t) / 0.6)
    add(drone, 0, 0, 0.09)
    # the chatter: soft blips that multiply as the crowd grows, then get pulled away
    for i in range(420):
        at = 0.4 + (rng.random() ** 0.6) * 7.4
        if rng.random() < 0.55 or at > 2.6:
            add(pop(380 + rng.random() * 1100), at, rng.uniform(-.9, .9), 0.02 + 0.03 * rng.random())
    # the pull: a long swell and a rising tone into the shell
    add(whoosh(3.0), 5.3, 0, 0.32)
    tt = t_(2.8); glide = np.sin(2 * np.pi * np.cumsum(110 * 2 ** (tt / 1.4)) / SR) * np.sin(np.pi * tt / 2.8) ** 2
    add(glide, 5.4, 0, 0.05)
    add(pop(520), 5.0, 0, 0.12)                                                     # the shell arrives
    add(thud(), 8.25, 0, 0.22)                                                      # it closes, then silence
    for f, d in ((hz(84), 0), (hz(88), 0.11), (hz(91), 0.22), (hz(96), 0.4)):         # the pearl
        add(chime(f), 9.8 + d, 0, 0.09)
    sparkle(9.9, n=14, spread=0.8)
    add(pop(1180), 11.05, 0.2, 0.2)                                                  # the card
    for i in range(10): add(tick(), 12.6 + i * 0.09, 0.1, 0.3)                       # the reply drafting
    add(whoosh(0.8), 14.05, 0, 0.22)                                                 # the bloom
    bed([(0, F_MAJ)], 99, 17.9, start=14.4)                                          # the motif, no drums
    add(pad(hz(65), 3.5), 14.4, 0, 0.06)
    close(16.75, 17.25)

elif FILM == 'film5':
    def marimba(f, d=0.6):
        t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 30)) * np.exp(-t * 7)
    def boing(f0=180, f1=520, d=0.35):
        t = t_(d); fr = f0 * (f1 / f0) ** (t / d); ph = 2 * np.pi * np.cumsum(fr) / SR
        return np.sin(ph + 2.5 * np.sin(2 * np.pi * 28 * t)) * np.exp(-t * 6)
    def wah(f, d=0.5):
        t = t_(d); fr = f * (1 - 0.06 * t / d) * (1 + 0.012 * np.sin(2 * np.pi * 6 * t)); ph = 2 * np.pi * np.cumsum(fr) / SR
        s = sum(np.sin(k * ph) / k for k in range(1, 7)); return s * np.minimum(1, t / 0.04) * np.exp(-t * 2.2)
    def clap():
        t = t_(0.12); n = rng.standard_normal(len(t)); n = n - np.r_[0, n[:-1]] * 0.6; return n * np.exp(-t * 35) * 0.5
    BB = 0.5                                                  # 120 BPM
    C_MAJ = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]]
    tune = [0, 2, 1, 3, 2, 1, 2, 3]
    def play(a, b, loud=1.0, drums=True):
        t0 = a
        while t0 < b - 0.01:
            bar = int((t0 + 1e-6) / (4 * BB)); ch = C_MAJ[bar % 4]
            for k in range(8):
                tt = t0 + k * BB / 2
                if tt >= b: break
                add(marimba(hz(ch[tune[k]] + 12)), tt, (-0.3 if k % 2 else 0.3), 0.11 * loud)
            for k in range(4):
                tt = t0 + k * BB
                if tt >= b: break
                add(marimba(hz(ch[0] - 12), 0.4), tt, 0, 0.14 * loud)
                if drums:
                    if k in (0, 2): add(kick(), tt, 0, 0.26 * loud)
                    else: add(clap(), tt, 0.1, 0.3 * loud)
            t0 += 4 * BB
    play(0.75, 2.75, 0.8, drums=False)                        # hello
    play(4.6, 9.3, 1.0)                                       # the rescue
    play(9.5, 14.0, 1.15)                                     # the happy ending
    # Chrysa drops in and bounces
    t = t_(0.6); add(np.sin(2 * np.pi * np.cumsum(1400 * 2 ** (-t / 0.25)) / SR) * np.exp(-t * 2), 0.15, 0, 0.08)
    for at, g in ((0.75, 0.3), (1.25, 0.2), (1.55, 0.13), (1.75, 0.08)): add(boing(), at, -0.2, g)
    # uh-oh: a sad wah-wah under the rain cloud
    for i, (n, at) in enumerate(((62, 2.95), (61, 3.45), (60, 3.95))): add(wah(hz(n - 12), 0.55 if i < 2 else 0.9), at, 0, 0.12)
    for i in range(30): add(tick(), 2.7 + i * 0.065 + rng.random() * 0.03, rng.uniform(-.3, .5), 0.12)   # rain
    # jumps and pops
    for c in (5.2, 6.5, 7.8):
        add(boing(220, 660, 0.3), c - 0.38, -0.2, 0.18)
        add(pop(1400), c, 0, 0.3); add(pop(2100), c + 0.03, 0.2, 0.18)
        sparkle(c, n=6, spread=0.3)
        add(boing(), c + 0.38, -0.2, 0.12)
    for i, c in enumerate((5.2, 6.5, 7.8)): add(marimba(hz((72, 76, 79)[i]), 1.0), c + 0.05, 0, 0.22)   # 1! 2! 3!
    for i in range(6): add(pop(900 + i * 120), 8.45 + i * 0.28, rng.uniform(-.5, .5), 0.12)          # the crowd
    # the café cheers up: a rising fanfare, then "Yay!"
    for i, n in enumerate((60, 64, 67, 72, 76, 79, 84)): add(marimba(hz(n), 0.8), 9.3 + i * 0.07, 0, 0.18)
    add(chime(hz(84)), 9.85, 0, 0.1); sparkle(9.9, n=30, spread=1.2)
    for at in (9.9, 10.3, 10.7, 12.3): add(boing(), at, -0.2, 0.12)
    t = t_(0.6); add(np.sin(2 * np.pi * np.cumsum(300 * 2 ** (t / 0.2)) / SR) * np.sin(np.pi * t / 0.6), 11.7, 0, 0.05)  # the spin
    add(whoosh(0.7), 13.85, 0, 0.18)
    close(14.65, 15.15, root=60)

elif FILM == 'film6':
    bed([(0, F_MAJ)], 2.3, 18.7)
    add(pop(660), 0.4, 0, 0.22); add(epiano(hz(84), 2), 0.45, 0, 0.12)            # title
    add(whoosh(0.5), 1.7, 0, 0.14)                                                 # the tab opens
    QT = [(2.3, 'How are Reels doing?'), (5.05, 'Why did Tuesday’s sales dip?'), (8.0, 'What are people saying about us?'), (10.75, 'Who should we work with next?')]
    for t0, q in QT:
        dur = min(0.75, len(q) * 0.03)
        for k in range(len(q)):
            if q[k] != ' ': add(tick(), t0 + k * dur / len(q), 0.15, 0.32)
        send = t0 + dur + 0.12
        add(pop(1180), send, 0.3, 0.2)                                             # sent
        add(pop(760), send + 0.25 + 0.5, -0.3, 0.2)                                # answered
        add(epiano(hz(84), 1.0), send + 0.25 + 0.5, -0.2, 0.08)
        add(tick(), send + 0.25 + 0.5 + 0.3, 0, 0.3)                               # evidence tag
    # the spoken question
    add(pop(520), 13.5, 0, 0.16)
    t = t_(1.05); add(np.sin(2 * np.pi * 220 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * t)) * np.sin(np.pi * t / 1.05), 13.5, 0, 0.03)
    add(pop(1180), 14.67, 0.3, 0.2); add(pop(760), 15.47, -0.3, 0.2)
    add(pop(1400), 16.62, 0, 0.26); add(chime(hz(84)), 16.65, 0, 0.08)            # approved
    add(whoosh(0.5), 16.75, 0, 0.14)
    for i in range(10): add(pop(900 + (i % 5) * 140), 17.0 + i * 0.13, -0.6 + (i % 5) * 0.3, 0.13)   # the flurry
    add(thud(), 17.65, 0, 0.18); add(chime(hz(81)), 17.68, 0, 0.07)
    close(18.8, 19.3)

def room(x):
    y = x.copy()
    for d, g in ((0.031, 0.25), (0.053, 0.18), (0.089, 0.12), (0.137, 0.08)):
        k = int(d * SR); y[k:] += x[:-k] * g
    return y
L, R = room(L), room(R)
fade = np.ones(N); fi = int(0.05 * SR); fo = int(0.7 * SR)
fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
L *= fade; R *= fade
m = max(np.abs(L).max(), np.abs(R).max()); L, R = L / m * 0.8, R / m * 0.8
pcm = (np.stack([L, R], 1) * 32767).astype('<i2')
w = wave.open(sys.argv[1] if len(sys.argv) > 1 else 'soundtrack.wav', 'wb')
w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
