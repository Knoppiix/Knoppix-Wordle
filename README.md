# Knoppix's Wordle - French version

Welcome to my version of the popular game Wordle, built using Vue.js! This project replicates the word puzzle game "Wordle" made by Josh Wardle, which I made my own version.
In Knoppix's Wordle, you have to guess a secret eight-letter word within eight tries. 
Each guess provides feedback indicating how many letters are correct and in the correct position, and how many letters are correct but in the wrong position.
![image](https://github.com/Knoppiix/Knoppix-Wordle/assets/77052607/df6777c0-2b03-42a6-8562-47e7f739db77)

## Rules

1. **Objective**: Guess the hidden eight-letter word within eight attempts.
2. **Guessing**: Enter a eight-letter word and press "Enter".
3. **Feedback**:
    - A letter in the correct position will be highlighted in blue.
    - A letter in the word but in the wrong position will be highlighted in gray-brown.
    - A letter not in the word will be highlighted in red.
4. **Winning**: You win if you guess the word correctly within eight tries.
5. **Losing**: If you don't guess the word within eight tries, you lose. The correct word will be revealed.

## How to Build

To build and run this project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Knoppiix/Knoppix-Wordle.git
    cd Knoppix-Wordle
    ```
2. **Run the development server**:
You can use any http server, such as python http server :
    ```bash
    python3 -m http.server
    ```


## Technologies Used

- **Vue.js**
- **JavaScript**
- **HTML5 & CSS3**

## Contributing

Feel free to open issues or submit pull requests. Contributions are welcome!

---

Enjoy playing my Wordle in Vue.js!

