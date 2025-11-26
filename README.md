# 🎨 Color Tap Rush

A simple but addictive Android reaction game built with React Native.

## Game Description

Test your reflexes and color recognition! Tap the correct color as fast as you can before time runs out. Build combos to multiply your score!

## Features

- ⚡ Fast-paced gameplay
- 🎯 Simple tap mechanics
- 🔥 Combo system for bonus points
- 🏆 High score tracking
- 📱 Clean, modern UI
- 🎨 6 vibrant colors

## How to Play

1. The target color name appears in a big box at the center
2. Tap the matching color from the 4 options below
3. Correct taps = points! Build combos for multipliers
4. You have 30 seconds - how high can you score?

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- React Native CLI
- Android Studio (for Android development)
- JDK 11 or higher

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ColorTapRush.git
   cd ColorTapRush
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Metro bundler:**
   ```bash
   npm start
   ```

4. **Run on Android:**
   ```bash
   npm run android
   ```
   (Make sure you have an Android emulator running or a device connected)

## Building APK

To build a release APK:

```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Tech Stack

- React Native 0.72
- React 18.2
- AsyncStorage for high score persistence

## Game Mechanics

- **Scoring:** 10 points per correct tap
- **Combo System:** Every 3 consecutive correct taps = score multiplier increases
- **Time Limit:** 30 seconds per game
- **Difficulty:** Random color arrangement keeps you on your toes!

## Future Ideas

- Difficulty levels (faster time, more colors)
- Power-ups (freeze time, double points)
- Sound effects and music
- Online leaderboards
- Different game modes

## License

MIT License - Feel free to use and modify!

---

Built with ❤️ - Have fun playing!
