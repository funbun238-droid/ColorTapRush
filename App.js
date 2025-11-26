import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  StatusBar,
  Vibration,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = [
  { name: 'RED', bg: '#FF3B30', color: '#FFFFFF' },
  { name: 'BLUE', bg: '#007AFF', color: '#FFFFFF' },
  { name: 'GREEN', bg: '#34C759', color: '#FFFFFF' },
  { name: 'YELLOW', bg: '#FFCC00', color: '#000000' },
  { name: 'PURPLE', bg: '#AF52DE', color: '#FFFFFF' },
  { name: 'ORANGE', bg: '#FF9500', color: '#FFFFFF' },
];

const GAME_TIME = 30;

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameState, setGameState] = useState('start'); // start, playing, gameOver
  const [targetColor, setTargetColor] = useState(null);
  const [options, setOptions] = useState([]);
  const [combo, setCombo] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    loadHighScore();
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      generateRound();
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameState]);

  const loadHighScore = async () => {
    try {
      const saved = await AsyncStorage.getItem('highScore');
      if (saved) setHighScore(parseInt(saved));
    } catch (e) {
      console.log('Error loading high score');
    }
  };

  const saveHighScore = async (newScore) => {
    try {
      await AsyncStorage.setItem('highScore', newScore.toString());
    } catch (e) {
      console.log('Error saving high score');
    }
  };

  const generateRound = () => {
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    const target = shuffled[Math.floor(Math.random() * shuffled.length)];
    const opts = shuffled.slice(0, 4);

    if (!opts.includes(target)) {
      opts[Math.floor(Math.random() * opts.length)] = target;
    }

    setTargetColor(target);
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setCombo(0);
    setGameState('playing');
  };

  const endGame = () => {
    setGameState('gameOver');
    if (score > highScore) {
      setHighScore(score);
      saveHighScore(score);
    }
  };

  const handleColorTap = (selectedColor) => {
    if (selectedColor.name === targetColor.name) {
      // Correct answer
      const comboMultiplier = Math.floor(combo / 3) + 1;
      const points = 10 * comboMultiplier;
      setScore(score + points);
      setCombo(combo + 1);

      // Animate
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      generateRound();
    } else {
      // Wrong answer
      setCombo(0);
      Vibration.vibrate(200);
    }
  };

  if (gameState === 'start') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>🎨 Color Tap Rush</Text>
        <Text style={styles.subtitle}>Tap the correct color as fast as you can!</Text>
        <Text style={styles.highScoreText}>High Score: {highScore}</Text>

        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>START GAME</Text>
        </TouchableOpacity>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>• Tap the color shown at the top</Text>
          <Text style={styles.instructionText}>• Build combos for bonus points</Text>
          <Text style={styles.instructionText}>• You have {GAME_TIME} seconds!</Text>
        </View>
      </View>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Game Over!</Text>
        <Text style={styles.finalScore}>Score: {score}</Text>
        {score === highScore && score > 0 && (
          <Text style={styles.newHighScore}>🎉 NEW HIGH SCORE! 🎉</Text>
        )}
        <Text style={styles.highScoreText}>High Score: {highScore}</Text>

        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>PLAY AGAIN</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.timerText}>⏱ {timeLeft}s</Text>
      </View>

      {combo > 0 && (
        <Text style={styles.comboText}>
          🔥 COMBO x{Math.floor(combo / 3) + 1}
        </Text>
      )}

      <Animated.View 
        style={[
          styles.targetBox,
          { 
            backgroundColor: targetColor?.bg,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Text style={[styles.targetText, { color: targetColor?.color }]}>
          {targetColor?.name}
        </Text>
      </Animated.View>

      <View style={styles.optionsContainer}>
        {options.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, { backgroundColor: color.bg }]}
            onPress={() => handleColorTap(color)}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, { color: color.color }]}>
              {color.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 50,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  comboText: {
    color: '#FF9500',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: '#FF9500',
    textShadowRadius: 10,
  },
  targetBox: {
    width: 250,
    height: 250,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  targetText: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  optionButton: {
    width: '45%',
    height: 80,
    margin: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  optionText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  highScoreText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  instructions: {
    marginTop: 50,
    alignItems: 'flex-start',
  },
  instructionText: {
    color: '#8E8E93',
    fontSize: 16,
    marginBottom: 10,
  },
  finalScore: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  newHighScore: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
