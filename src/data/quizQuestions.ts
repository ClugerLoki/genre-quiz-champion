interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export const quizQuestions: Record<string, Question[]> = {
  science: [
    {
      id: 'sci-1',
      question: 'What is the chemical symbol for gold?',
      options: ['Go', 'Au', 'Ag', 'Gd'],
      correctAnswer: 1,
      explanation: 'Au comes from the Latin word "aurum" meaning gold.'
    },
    {
      id: 'sci-2', 
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
      correctAnswer: 2,
      explanation: 'Mars appears red due to iron oxide (rust) on its surface.'
    },
    {
      id: 'sci-3',
      question: 'What is the speed of light in vacuum?',
      options: ['300,000 km/s', '299,792,458 m/s', '186,000 miles/s', 'All of the above'],
      correctAnswer: 3,
      explanation: 'The speed of light is a constant and can be expressed in different units.'
    },
    {
      id: 'sci-4',
      question: 'Which organ in the human body produces insulin?',
      options: ['Liver', 'Kidney', 'Pancreas', 'Stomach'],
      correctAnswer: 2,
      explanation: 'The pancreas produces insulin to regulate blood sugar levels.'
    },
    {
      id: 'sci-5',
      question: 'What is the most abundant gas in Earth\'s atmosphere?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
      correctAnswer: 2,
      explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere.'
    }
  ],

  history: [
    {
      id: 'hist-1',
      question: 'In which year did World War II end?',
      options: ['1944', '1945', '1946', '1947'],
      correctAnswer: 1,
      explanation: 'World War II ended in 1945 with the surrender of Japan in September.'
    },
    {
      id: 'hist-2',
      question: 'Who was the first President of the United States?',
      options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
      correctAnswer: 2,
      explanation: 'George Washington served as the first President from 1789 to 1797.'
    },
    {
      id: 'hist-3',
      question: 'The Berlin Wall fell in which year?',
      options: ['1987', '1989', '1991', '1993'],
      correctAnswer: 1,
      explanation: 'The Berlin Wall fell on November 9, 1989, marking the end of the Cold War era.'
    },
    {
      id: 'hist-4',
      question: 'Which ancient wonder of the world was located in Alexandria?',
      options: ['Hanging Gardens', 'Lighthouse of Alexandria', 'Colossus of Rhodes', 'Great Pyramid'],
      correctAnswer: 1,
      explanation: 'The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World.'
    },
    {
      id: 'hist-5',
      question: 'The French Revolution began in which year?',
      options: ['1789', '1790', '1791', '1792'],
      correctAnswer: 0,
      explanation: 'The French Revolution began in 1789 with the storming of the Bastille.'
    }
  ],

  geography: [
    {
      id: 'geo-1',
      question: 'What is the capital of Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      correctAnswer: 2,
      explanation: 'Canberra is the capital city of Australia, not Sydney or Melbourne.'
    },
    {
      id: 'geo-2',
      question: 'Which is the longest river in the world?',
      options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
      correctAnswer: 1,
      explanation: 'The Nile River is approximately 6,650 kilometers long.'
    },
    {
      id: 'geo-3',
      question: 'Mount Everest is located in which mountain range?',
      options: ['Andes', 'Himalayas', 'Alps', 'Rockies'],
      correctAnswer: 1,
      explanation: 'Mount Everest is part of the Himalayan mountain range.'
    },
    {
      id: 'geo-4',
      question: 'Which country has the most time zones?',
      options: ['Russia', 'United States', 'China', 'France'],
      correctAnswer: 3,
      explanation: 'France has 12 time zones due to its overseas territories.'
    },
    {
      id: 'geo-5',
      question: 'The Sahara Desert is located in which continent?',
      options: ['Asia', 'Australia', 'Africa', 'South America'],
      correctAnswer: 2,
      explanation: 'The Sahara Desert covers much of North Africa.'
    }
  ],

  sports: [
    {
      id: 'sport-1',
      question: 'How many players are on a basketball team on the court at one time?',
      options: ['4', '5', '6', '7'],
      correctAnswer: 1,
      explanation: 'Each basketball team has 5 players on the court at any given time.'
    },
    {
      id: 'sport-2',
      question: 'Which country won the FIFA World Cup in 2018?',
      options: ['Brazil', 'Germany', 'France', 'Argentina'],
      correctAnswer: 2,
      explanation: 'France won the 2018 FIFA World Cup held in Russia.'
    },
    {
      id: 'sport-3',
      question: 'In which sport would you perform a slam dunk?',
      options: ['Tennis', 'Basketball', 'Volleyball', 'Baseball'],
      correctAnswer: 1,
      explanation: 'A slam dunk is a basketball move where the player jumps and scores.'
    },
    {
      id: 'sport-4',
      question: 'How many rings are there in the Olympic Games symbol?',
      options: ['4', '5', '6', '7'],
      correctAnswer: 1,
      explanation: 'The Olympic symbol has 5 interlocking rings representing the continents.'
    },
    {
      id: 'sport-5',
      question: 'Which sport is known as "The Beautiful Game"?',
      options: ['Basketball', 'Tennis', 'Soccer/Football', 'Golf'],
      correctAnswer: 2,
      explanation: 'Soccer (football) is often called "The Beautiful Game".'
    }
  ],

  technology: [
    {
      id: 'tech-1',
      question: 'Who is known as the co-founder of Microsoft?',
      options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Larry Page'],
      correctAnswer: 1,
      explanation: 'Bill Gates co-founded Microsoft with Paul Allen in 1975.'
    },
    {
      id: 'tech-2',
      question: 'What does "AI" stand for in technology?',
      options: ['Automated Intelligence', 'Artificial Intelligence', 'Advanced Integration', 'Automated Integration'],
      correctAnswer: 1,
      explanation: 'AI stands for Artificial Intelligence.'
    },
    {
      id: 'tech-3',
      question: 'Which company developed the iPhone?',
      options: ['Samsung', 'Google', 'Apple', 'Microsoft'],
      correctAnswer: 2,
      explanation: 'Apple developed and released the first iPhone in 2007.'
    },
    {
      id: 'tech-4',
      question: 'What does "URL" stand for?',
      options: ['Universal Resource Locator', 'Uniform Resource Locator', 'Universal Reference Link', 'Uniform Reference Link'],
      correctAnswer: 1,
      explanation: 'URL stands for Uniform Resource Locator.'
    },
    {
      id: 'tech-5',
      question: 'Which programming language is primarily used for web development styling?',
      options: ['JavaScript', 'Python', 'CSS', 'Java'],
      correctAnswer: 2,
      explanation: 'CSS (Cascading Style Sheets) is used for styling web pages.'
    }
  ],

  music: [
    {
      id: 'music-1',
      question: 'How many strings does a standard guitar have?',
      options: ['4', '5', '6', '7'],
      correctAnswer: 2,
      explanation: 'A standard guitar has 6 strings.'
    },
    {
      id: 'music-2',
      question: 'Which composer wrote "The Four Seasons"?',
      options: ['Bach', 'Mozart', 'Vivaldi', 'Beethoven'],
      correctAnswer: 2,
      explanation: 'Antonio Vivaldi composed "The Four Seasons" in 1725.'
    },
    {
      id: 'music-3',
      question: 'What does "forte" mean in music?',
      options: ['Soft', 'Loud', 'Fast', 'Slow'],
      correctAnswer: 1,
      explanation: 'Forte is a musical term meaning loud or strong.'
    },
    {
      id: 'music-4',
      question: 'Which instrument is Yo-Yo Ma famous for playing?',
      options: ['Violin', 'Piano', 'Cello', 'Flute'],
      correctAnswer: 2,
      explanation: 'Yo-Yo Ma is a world-renowned cellist.'
    },
    {
      id: 'music-5',
      question: 'How many keys are on a standard piano?',
      options: ['76', '88', '100', '104'],
      correctAnswer: 1,
      explanation: 'A standard piano has 88 keys (52 white and 36 black).'
    }
  ],

  art: [
    {
      id: 'art-1',
      question: 'Who painted the Mona Lisa?',
      options: ['Michelangelo', 'Leonardo da Vinci', 'Pablo Picasso', 'Vincent van Gogh'],
      correctAnswer: 1,
      explanation: 'Leonardo da Vinci painted the Mona Lisa between 1503-1519.'
    },
    {
      id: 'art-2',
      question: 'Which art movement is Salvador Dalí associated with?',
      options: ['Cubism', 'Impressionism', 'Surrealism', 'Abstract Expressionism'],
      correctAnswer: 2,
      explanation: 'Salvador Dalí was a prominent figure in the Surrealist movement.'
    },
    {
      id: 'art-3',
      question: 'What are the three primary colors?',
      options: ['Red, Blue, Yellow', 'Red, Green, Blue', 'Blue, Yellow, Orange', 'Red, Yellow, Green'],
      correctAnswer: 0,
      explanation: 'The three primary colors are red, blue, and yellow.'
    },
    {
      id: 'art-4',
      question: 'Which museum houses the Mona Lisa?',
      options: ['Metropolitan Museum', 'British Museum', 'Louvre Museum', 'Uffizi Gallery'],
      correctAnswer: 2,
      explanation: 'The Mona Lisa is housed in the Louvre Museum in Paris.'
    },
    {
      id: 'art-5',
      question: 'Who sculpted the statue of David?',
      options: ['Donatello', 'Michelangelo', 'Rodin', 'Bernini'],
      correctAnswer: 1,
      explanation: 'Michelangelo sculpted the famous statue of David between 1501-1504.'
    }
  ],

  mathematics: [
    {
      id: 'math-1',
      question: 'What is the value of π (pi) to two decimal places?',
      options: ['3.14', '3.15', '3.16', '3.17'],
      correctAnswer: 0,
      explanation: 'π (pi) is approximately 3.14159... or 3.14 to two decimal places.'
    },
    {
      id: 'math-2',
      question: 'What is the square root of 144?',
      options: ['11', '12', '13', '14'],
      correctAnswer: 1,
      explanation: '12 × 12 = 144, so the square root of 144 is 12.'
    },
    {
      id: 'math-3',
      question: 'In a right triangle, what is the longest side called?',
      options: ['Adjacent', 'Opposite', 'Hypotenuse', 'Base'],
      correctAnswer: 2,
      explanation: 'The hypotenuse is the longest side of a right triangle, opposite the right angle.'
    },
    {
      id: 'math-4',
      question: 'What is 15% of 200?',
      options: ['25', '30', '35', '40'],
      correctAnswer: 1,
      explanation: '15% of 200 = 0.15 × 200 = 30.'
    },
    {
      id: 'math-5',
      question: 'What comes next in the sequence: 2, 4, 8, 16, ...?',
      options: ['24', '30', '32', '36'],
      correctAnswer: 2,
      explanation: 'This is a geometric sequence where each term is doubled: 16 × 2 = 32.'
    }
  ]
};