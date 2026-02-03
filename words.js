// Word lists organized by themes and difficulty
const WORD_LISTS = {
    // 3-letter words - Easy
    easy: {
        animals: ['cat', 'dog', 'fox', 'owl', 'bee', 'ant', 'bat', 'pig', 'hen', 'rat'],
        colors: ['red', 'tan', 'sky'],
        nature: ['sun', 'sea', 'sky', 'mud', 'ice', 'dew'],
        body: ['eye', 'arm', 'leg', 'ear', 'toe'],
        food: ['egg', 'pie', 'jam', 'tea', 'ham'],
        actions: ['run', 'hop', 'sit', 'dig', 'hug', 'jog'],
        things: ['box', 'cup', 'toy', 'pen', 'key', 'bag', 'hat', 'bed']
    },
    
    // 4-letter words - Medium
    medium: {
        animals: ['bird', 'fish', 'duck', 'frog', 'crab', 'bear', 'deer', 'seal', 'lamb'],
        colors: ['blue', 'pink', 'gold', 'gray'],
        nature: ['tree', 'pond', 'sand', 'rain', 'wind', 'moon', 'star', 'rock', 'leaf'],
        body: ['hand', 'foot', 'nose', 'face', 'hair', 'knee'],
        food: ['milk', 'cake', 'plum', 'pear', 'corn', 'rice', 'soup', 'taco'],
        actions: ['jump', 'swim', 'walk', 'play', 'sing', 'draw', 'help', 'look'],
        things: ['book', 'ball', 'door', 'home', 'boat', 'bell', 'rock', 'gift', 'flag']
    },
    
    // 5-letter words - Hard
    hard: {
        animals: ['whale', 'shark', 'tiger', 'horse', 'mouse', 'snake', 'sheep', 'zebra'],
        colors: ['green', 'white', 'brown', 'black'],
        nature: ['ocean', 'river', 'beach', 'plant', 'cloud', 'grass', 'stone', 'water'],
        body: ['belly', 'thumb', 'teeth', 'chest'],
        food: ['apple', 'bread', 'lemon', 'melon', 'pizza', 'berry', 'candy', 'peach'],
        actions: ['dance', 'climb', 'laugh', 'sleep', 'think', 'count', 'smile'],
        things: ['house', 'chair', 'table', 'truck', 'train', 'plate', 'spoon', 'beach', 'phone']
    }
};

// Get all words from a difficulty level
function getWordsByDifficulty(difficulty) {
    const wordSet = WORD_LISTS[difficulty];
    const allWords = [];
    
    for (let category in wordSet) {
        allWords.push(...wordSet[category]);
    }
    
    return allWords;
}

// Get words from a specific theme
function getWordsByTheme(difficulty, theme) {
    return WORD_LISTS[difficulty][theme] || [];
}

// Get a random word from a difficulty level
function getRandomWord(difficulty) {
    const words = getWordsByDifficulty(difficulty);
    return words[Math.floor(Math.random() * words.length)];
}

// Get all available themes
function getAvailableThemes() {
    return Object.keys(WORD_LISTS.easy);
}
