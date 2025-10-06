import {vocab_cu1} from './vocab/cu1.js';
import {vocab_cu2} from './vocab/cu2.js';
import {vocab_cu3} from './vocab/cu3.js';
import {vocab_cu4} from './vocab/cu4.js';
import {vocab_truong} from './vocab/truong.js';
import {vocabListKhiem} from './vocab/khiem.js';



// Hardcoded login credentials
const vocabLists = {
  truong: vocab_truong,
  khiem: vocabListKhiem,
  cu1: vocab_cu1,
  cu2: vocab_cu2,
  cu3: vocab_cu3,
  cu4: vocab_cu4
};

const credentials = {
  truong: "1234",
  khiem: "1234",
  cu1: "1234",
  cu2: "1234",
  cu3: "1234",
  cu4: "1234"
};

let currentVocabList = [];
let unseenWords = [];
let wrongQueue = [];
let currentWord = null;
let score = 0;
let hintIndex = 0;
let currentAttempt = 0;

// DOM Elements for login screen
const loginScreen = document.getElementById("login-screen");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const loginFeedback = document.getElementById("login-feedback");

// DOM Elements for quiz screen
const quizScreen = document.getElementById("quiz-screen");
const progressEl = document.getElementById("progress");
const vietnameseEl = document.getElementById("vietnamese");
const wordInput = document.getElementById("wordInput");
const typeInput = document.getElementById("typeInput");
const checkBtn = document.getElementById("check-btn");
const skipBtn = document.getElementById("skip-btn");
const feedbackEl = document.getElementById("feedback");

// Hai nút "gợi ý" mới và hai ô hiển thị gợi ý
const wordHintBtn = document.getElementById("word-hint-btn");
const letterHintEl = document.getElementById("letter-hint");
const typeHintBtn = document.getElementById("type-hint-btn");
const typeHintEl = document.getElementById("type-hint");

// Audio elements for sound effects
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// Login function
function loginFunction() {
  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  if (!(username in credentials)) {
    loginFeedback.textContent = "Wrong username.";
    loginFeedback.style.color = "red";
    return;
  }
  if (credentials[username] !== password) {
    loginFeedback.textContent = "Wrong password.";
    loginFeedback.style.color = "red";
    return;
  }
  
  loginFeedback.textContent = "Đăng nhập thành công!";
  loginFeedback.style.color = "green";
  // Set the vocabulary list based on the username
  currentVocabList = vocabLists[username];
  startExam();
}

// Bind Enter key for login
usernameInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") loginFunction();
});
passwordInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") loginFunction();
});
loginBtn.addEventListener("click", loginFunction);

// Quiz event listeners
checkBtn.addEventListener("click", checkAnswer);
skipBtn.addEventListener("click", skipQuestion);

// Gợi ý dần từng chữ cái
wordHintBtn.addEventListener("click", showWordHint);
// Gợi ý loại từ
typeHintBtn.addEventListener("click", showTypeHint);

// Bind Enter key for submitting the answer
wordInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") checkAnswer();
});
typeInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") checkAnswer();
});

// Start the quiz after successful login
function startExam() {
  // Hide login screen and show quiz screen
  loginScreen.style.display = "none";
  quizScreen.style.display = "block";
  score = 0;
  unseenWords = [...currentVocabList];
  wrongQueue = []; 
  progressEl.textContent = `Đã đúng: ${score}/${currentVocabList.length}`;
  nextQuestion();
}

function nextQuestion() {
  // If no more cards, finish
  if (unseenWords.length === 0 && wrongQueue.length === 0) {
    return endQuiz();
  }

  // 1) If there are still unseen words, pick one at random
  if (unseenWords.length > 0) {
    const idx       = Math.floor(Math.random() * unseenWords.length);
    currentWord     = unseenWords.splice(idx, 1)[0];
  }
  // 2) Otherwise, dequeue from the front of wrongQueue
  else {
    currentWord = wrongQueue.shift();
  }

  // Reset hints + attempts
  currentAttempt = 0;
  hintIndex      = 0;

  // Show the Vietnamese meaning
  vietnameseEl.textContent = `Nghĩa: ${currentWord.vietnamese}`;

  // Clear input fields, feedback, and hints
  wordInput.value         = "";
  typeInput.value         = "";
  feedbackEl.textContent  = "";
  letterHintEl.textContent = "";
  typeHintEl.textContent   = "";
  wordInput.classList.remove("error");
  typeInput.classList.remove("error");

  wordInput.focus();
}

function showWordHint() {
  const correctWord = currentWord.word.toLowerCase();
  if (hintIndex < correctWord.length) {
    hintIndex++;
  }
  letterHintEl.textContent = correctWord.substring(0, hintIndex);
}

function showTypeHint() {
  // Hiển thị loại từ một lần (n, v, adj, adv...)
  typeHintEl.textContent = currentWord.type;
}

function skipQuestion() {
  wrongQueue.push(currentWord);
  nextQuestion();
}

function checkAnswer() {
  const userWord    = wordInput.value.trim().toLowerCase();
  const userType    = typeInput.value.trim().toLowerCase();
  const correctWord = currentWord.word.trim().toLowerCase();
  const correctType = currentWord.type.trim().toLowerCase();

  // Remove any old red‐border styling
  wordInput.classList.remove("error");
  typeInput.classList.remove("error");

  const wordIsRight = (userWord === correctWord);
  const typeIsRight = (userType === correctType);

  if (wordIsRight && typeIsRight) {
    // (A) Perfect first try → full point
    if (currentAttempt === 0 && hintIndex === 0) {
      feedbackEl.textContent = "Đúng!";
      feedbackEl.style.color = "green";
      score++;
      progressEl.textContent = `Đã đúng: ${score}/${currentVocabList.length}`;
      correctSound.play();

      // If by any chance it’s still in wrongQueue, remove it
      // const idxInQueue = wrongQueue.indexOf(currentWord);
      // if (idxInQueue !== -1) {
      //   wrongQueue.splice(idxInQueue, 1);
      // }
    }
    // (B) Right after a hint or wrong attempt → no point, re‐enqueue
    else {
      feedbackEl.textContent = "Đúng nhưng không tính điểm vì đã sai/gợi ý. Từ này sẽ xuất hiện lại.";
      feedbackEl.style.color = "orange";
      correctSound.play();
      wrongQueue.push(currentWord);
    }
    nextQuestion();
  } 
  else {
    // (C) At least one field is wrong right now
    if (!wordIsRight) {
      wordInput.classList.add("error");
    }
    if (!typeIsRight) {
      typeInput.classList.add("error");
    }
    currentAttempt++;
    wrongSound.play();
  }
}

function endQuiz() {
  vietnameseEl.textContent = "Kết thúc kiểm tra!";
  feedbackEl.textContent = `Điểm của bạn: ${score}`;
  wordInput.disabled = true;
  typeInput.disabled = true;
}