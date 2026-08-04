# **Synchordia**
A browser-based polyphonic instrument controlled by real-time hand gestures.
Synchordia bridges the gap between computer vision and audio synthesis, allowing users to play continuous, cinematic musical chords using just their webcam and hand gestures. It features zero-latency audio routing, a glassmorphic UI, and built-in performance recording.
You can switch in 3 different instrument sounds: Harmonium, Ambient Pads & Strings. (Harmonium one is not working for some reason I'll update this once it starts working)
If you're a struggling artist and love exploring musical stuffs, you'd definitely going to love this.

Note: Camera and microphone permissions are strictly required for the engines to initialize.


##  For Non-Musicians: How to Play

**You do not need to know any music theory to play Synchordia.** The instrument does the math for you. It automatically groups notes together so that no matter what you do, it will always sound harmonious and cinematic. 

All you need is one hand and your webcam:

* **1, 2, or 3 Fingers (Major Chords):** Holding up one to three fingers triggers "Major" chords. These generally sound bright, open, and triumphant.
* **4, 5, or 6 Fingers (Minor Chords):** Holding up four to six fingers (using both hands) triggers "Minor" chords. These sound moody, dark, and emotional. 
* **Zero Fingers:** Drop your hand to smoothly fade the audio out.

**Pro-Tip:** Don't just flash your fingers quickly. Hold your hand steady and let the synthesizer breathe. The instrument is designed with an "infinite sustain"—the chord will ring out beautifully for as long as you hold your fingers up.



## Run Locally
Want to explore the code or run the instrument on your own machine? 

**Prerequisites:** Ensure you have [Node.js](https://nodejs.org/) installed.

1. Clone the repository
2. Install dependencies:
   `npm install`
3. Run the app:
   `npm run dev`