// Character progression for typing practice
const CHARACTER_SETS = {
    // Level 1: Lowercase vowels
    vowels: ['a', 'e', 'i', 'o', 'u'],
    
    // Level 2: Common consonants
    commonConsonants: ['b', 'c', 'd', 'f', 'g', 'h', 'l', 'm', 'n', 'p', 'r', 's', 't'],
    
    // Level 3: Less common consonants
    lessCommonConsonants: ['j', 'k', 'q', 'v', 'w', 'x', 'y', 'z'],
    
    // Level 4: Uppercase letters
    uppercase: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    
    // Level 5: Numbers
    numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    
    // Level 6: Basic punctuation
    punctuation: ['.', ',', '!', '?'],
    
    // Special characters for special mode
    specialBasic: ['@', '#', '$', '%', '&', '*'],
    specialAdvanced: ['(', ')', '[', ']', '{', '}', '<', '>'],
    specialSymbols: ['+', '-', '=', '_', '/', '\\', '|'],
    specialPunctuation: [':', ';', '"', "'", '~', '`', '^']
};

// Get characters for a specific level
function getCharacterSet(level) {
    switch(level) {
        case 1:
            return CHARACTER_SETS.vowels;
        case 2:
            return [...CHARACTER_SETS.vowels, ...CHARACTER_SETS.commonConsonants];
        case 3:
            return [...CHARACTER_SETS.vowels, ...CHARACTER_SETS.commonConsonants, ...CHARACTER_SETS.lessCommonConsonants];
        case 4:
            return CHARACTER_SETS.uppercase;
        case 5:
            return CHARACTER_SETS.numbers;
        case 6:
            return CHARACTER_SETS.punctuation;
        default:
            return [...CHARACTER_SETS.vowels, ...CHARACTER_SETS.commonConsonants];
    }
}

// Get a random character from a level
function getRandomCharacter(level) {
    const characters = getCharacterSet(level);
    return characters[Math.floor(Math.random() * characters.length)];
}

// Get all lowercase letters
function getAllLowercase() {
    return [...CHARACTER_SETS.vowels, ...CHARACTER_SETS.commonConsonants, ...CHARACTER_SETS.lessCommonConsonants];
}

// Get special characters for a specific level
function getSpecialCharacterSet(level) {
    switch(level) {
        case 1:
            return CHARACTER_SETS.specialBasic;
        case 2:
            return [...CHARACTER_SETS.specialBasic, ...CHARACTER_SETS.specialAdvanced];
        case 3:
            return [...CHARACTER_SETS.specialBasic, ...CHARACTER_SETS.specialAdvanced, ...CHARACTER_SETS.specialSymbols];
        case 4:
            return [...CHARACTER_SETS.specialBasic, ...CHARACTER_SETS.specialAdvanced, ...CHARACTER_SETS.specialSymbols, ...CHARACTER_SETS.specialPunctuation];
        default:
            return CHARACTER_SETS.specialBasic;
    }
}

// Get a random special character from a level
function getRandomSpecialCharacter(level) {
    const characters = getSpecialCharacterSet(level);
    return characters[Math.floor(Math.random() * characters.length)];
}

// Generate a password-like string (mix of letters, numbers, and special characters)
function generatePassword(level) {
    let length = 3 + level; // Start with 4 characters, increase with level
    if (length > 12) length = 12; // Cap at 12 characters
    
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const numbers = '0123456789'.split('');
    const special = ['@', '#', '$', '%', '&', '*', '!', '?', '+', '-', '=', '_', '(', ')', '[', ']', '{', '}'];
    
    // Always include ALL character types for maximum difficulty
    const allChars = [...lowercase, ...uppercase, ...numbers, ...special];
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    return password;
}
