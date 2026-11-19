"""Original soundtrack for the Chrysa launch film (synthesised, royalty free).
python3 soundtrack.py out.wav"""
import numpy as np, wave, sys
SR=48000; DUR=19.0; N=int(SR*DUR)
L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(3)
def t_(d): return np.arange(int(d*SR))/SR
def add(sig,at,pan=0.0,gain=1.0):
    i=int(at*SR); j=min(N,i+len(sig)); sig=sig[:j-i]*gain
    L[i:j]+=sig*np.sqrt((1-pan)/2); R[i:j]+=sig*np.sqrt((1+pan)/2)
def hz(m): return 440*2**((m-69)/12)
def epiano(f,d=1.6):
    t=t_(d); env=np.exp(-t*2.6)*(1-np.exp(-t*400))
    mod=np.sin(2*np.pi*f*14*t)*np.exp(-t*9)*0.6
    return (np.sin(2*np.pi*f*t+mod)+0.25*np.sin(2*np.pi*2*f*t)*np.exp(-t*5))*env
def pad(f,d):
    t=t_(d); env=np.minimum(1,t/0.6)*np.minimum(1,(d-t)/0.8)
    s=sum(np.sin(2*np.pi*f*(1+dt)*t) for dt in (-0.003,0,0.004))/3
    return s*env
def kick():
    t=t_(0.35); f=48+90*np.exp(-t*30); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-t*9)
def hat():
    t=t_(0.06); n=rng.standard_normal(len(t)); n=np.diff(np.r_[0,n]); return n*np.exp(-t*70)*0.25
def pop(f=880):
    t=t_(0.14); fr=f*(1+0.6*np.exp(-t*40)); ph=2*np.pi*np.cumsum(fr)/SR
    return np.sin(ph)*np.exp(-t*34)
def whoosh(d=0.5,rev=False):
    t=t_(d); n=rng.standard_normal(len(t))
    # moving one-pole lowpass
    out=np.zeros_like(n); y=0; 
    for i in range(len(n)):
        a=0.02+0.25*np.sin(np.pi*i/len(n)); y+=a*(n[i]-y); out[i]=y
    env=np.sin(np.pi*t/d)**2
    return out*env*2.2
def chime(f):
    t=t_(2.4); return sum(np.sin(2*np.pi*f*k*t)*np.exp(-t*(1.6+k))/k for k in (1,2,3,4.2))
def tick():
    t=t_(0.03); return rng.standard_normal(len(t))*np.exp(-t*200)*0.5

BPM=100; B=60/BPM
# chord progression (Fmaj9, Am7, Dm9, Bbmaj7), one chord per bar
prog=[[53,57,60,64,67],[57,60,64,67],[50,57,60,64,65],[46,53,57,62]]
bars=int(DUR/(4*B))+1
for b in range(bars):
    t0=b*4*B; ch=prog[b%4]
    if t0>=16.95: break
    add(pad(hz(ch[0]+12),4*B+0.4),t0,0,0.05)
    add(pad(hz(ch[0]-12),4*B+0.2),t0,0,0.07)
    for k in range(8):           # arpeggio on eighths
        tt=t0+k*B/2
        if tt>16.55: break
        n=ch[[0,2,1,3,2,1,3,2][k]%len(ch)]+12
        add(epiano(hz(n),1.2),tt,(-0.4 if k%2 else 0.4),0.075)
    if t0>=3.9-4*B:              # rhythm section after the first reveal
        for k in range(4):
            tt=t0+k*B
            if 3.9<=tt<16.55:
                if k in (0,2): add(kick(),tt,0,0.32)
                add(hat(),tt+B/2,0.3,0.6)
                add(np.sin(2*np.pi*hz(ch[0]-24)*t_(B*0.9))*np.exp(-t_(B*0.9)*3),tt,0,0.12)
# transitions
for at in (3.85,4.7,6.55,7.5,11.95,14.3,15.45):
    add(whoosh(0.5),at,0.0,0.16)
# hero pop and cycler ticks
add(pop(660),0.5,0,0.25); add(epiano(hz(84),2),0.55,0,0.12)
for at in (2.35,2.6,2.85): add(tick(),at,0.2,0.4)
for at in (5.0,5.55,6.1): add(pop(520),at,0,0.18)
# outcome scene: a note per step, ticks as the number counts, sparkle on the confetti
for i,at in enumerate((7.85,8.3,8.75,9.2,9.65)): add(epiano(hz((65,69,72,76,77)[i]+12),1.0),at,0,0.13)
for i in range(4): add(tick(),10.3+i*0.12,0,0.5)
add(chime(hz(84)),10.8,0,0.08)
for i in range(22): add(pop(1800+rng.random()*1600)*0.5,10.8+rng.random()*1.0,rng.uniform(-.8,.8),0.11)
for at in (12.85,13.15,13.45,13.75): add(tick(),at,0,0.35)
# logo typing and chime
for i in range(6): add(tick(),16.7+i*0.075,0,0.5)
for f,d in ((hz(77),0),(hz(81),0.09),(hz(84),0.18),(hz(89),0.3)): add(chime(f),17.2+d,0,0.09)
add(pad(hz(53),2.2),16.75,0,0.06); add(pad(hz(60),2.2),16.75,0,0.05)
# simple stereo room: short delays
def room(x):
    y=x.copy()
    for d,g in ((0.031,0.25),(0.053,0.18),(0.089,0.12),(0.137,0.08)):
        k=int(d*SR); y[k:]+=x[:-k]*g
    return y
L,R=room(L),room(R[::-1])[::-1]*0+room(R)
# fade in/out and normalise
fade=np.ones(N); fi=int(0.05*SR); fo=int(0.7*SR)
fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo)
L*=fade; R*=fade
m=max(np.abs(L).max(),np.abs(R).max()); L,R=L/m*0.8,R/m*0.8
pcm=(np.stack([L,R],1)*32767).astype('<i2')
w=wave.open(sys.argv[1] if len(sys.argv)>1 else 'soundtrack.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
