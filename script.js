// Vocabulary lists for each user
const vocabListKhanh = [
  { "word": "demographic", "type": "adj", "vietnamese": "thuộc nhân khẩu học" },
  { "word": "trend",       "type": "n",   "vietnamese": "xu hướng" },
];

const vocabListKhiem = [
  { "word": "mismatch", "type": "n",   "vietnamese": "sự không phù hợp" },
  { "word": "specific", "type": "adj", "vietnamese": "cụ thể" },
  { "word": "purpose",  "type": "n",   "vietnamese": "mục đích" }
];

// Hardcoded login credentials
const credentials = {
  khanh: "1234",
  khiem: "1234"
};

let currentVocabList = [];
let unseenWords = [];
let wrongStack = [];
let currentWord = null;
let lastWord = null;
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
  currentVocabList = (username === "khanh") ? vocabListKhanh :
                     (username === "khiem") ? vocabListKhiem : [];
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
  wrongStack = [];
  progressEl.textContent = `Đã đúng: ${score}/${currentVocabList.length}`;
  nextQuestion();
}

function nextQuestion() {
  // Nếu hết cả unseenWords và wrongStack, kết thúc
  if (unseenWords.length === 0 && wrongStack.length === 0) {
    endQuiz();
    return;
  }
  
  // Chọn từ tiếp theo (tránh lặp lại ngay lập tức)
  let candidates = unseenWords.length > 0 ? unseenWords : wrongStack;
  if (candidates.length > 1 && lastWord) {
    candidates = candidates.filter(w => w !== lastWord);
  }
  
  currentWord = candidates[Math.floor(Math.random() * candidates.length)];
  
  // Nếu từ được chọn nằm trong unseenWords, xóa khỏi unseenWords
  const idxUnseen = unseenWords.indexOf(currentWord);
  if (idxUnseen !== -1) {
    unseenWords.splice(idxUnseen, 1);
  }
  
  currentAttempt = 0;
  hintIndex = 0;
  
  // Hiển thị nghĩa, reset các ô input và gợi ý
  vietnameseEl.textContent = `Nghĩa: ${currentWord.vietnamese}`;
  wordInput.value = "";
  typeInput.value = "";
  feedbackEl.textContent = "";
  letterHintEl.textContent = "Gợi ý: ";
  typeHintEl.textContent = "Loại từ: ";
  
  // Xóa viền đỏ (nếu có) từ lần trước
  wordInput.classList.remove("error");
  typeInput.classList.remove("error");
  
  wordInput.focus();
}

function showWordHint() {
  const correctWord = currentWord.word.toLowerCase();
  if (hintIndex < correctWord.length) {
    hintIndex++;
  }
  letterHintEl.textContent = `Gợi ý: ${correctWord.substring(0, hintIndex)}`;
}

function showTypeHint() {
  // Hiển thị loại từ một lần (n, v, adj, adv...)
  typeHintEl.textContent = `Loại từ: ${currentWord.type}`;
}

function skipQuestion() {
  if (!wrongStack.includes(currentWord)) {
    wrongStack.push(currentWord);
  }
  lastWord = currentWord;
  nextQuestion();
}

function checkAnswer() {
  const userWord = wordInput.value.trim().toLowerCase();
  const userType = typeInput.value.trim().toLowerCase();
  const correctWord = currentWord.word.trim().toLowerCase();
  const correctType = currentWord.type.trim().toLowerCase();
  
  // Reset viền đỏ mặc định
  wordInput.classList.remove("error");
  typeInput.classList.remove("error");
  
  // Kiểm tra từng phần riêng biệt
  const wordIsRight = (userWord === correctWord);
  const typeIsRight = (userType === correctType);
  
  if (wordIsRight && typeIsRight) {
    // Cả hai đúng
    if (currentAttempt > 0 || hintIndex > 0) {
      feedbackEl.textContent = "Đúng nhưng không tính điểm vì đã sai/gợi ý. Từ này sẽ xuất hiện lại.";
      feedbackEl.style.color = "orange";
      if (!wrongStack.includes(currentWord)) {
        wrongStack.push(currentWord);
      }
      correctSound.play();
    } else {
      feedbackEl.textContent = "Đúng!";
      feedbackEl.style.color = "green";
      score++;
      progressEl.textContent = `Đã đúng: ${score}/${currentVocabList.length}`;
      correctSound.play();
      // Nếu từ có trong wrongStack, xoá nó
      const idxWrong = wrongStack.indexOf(currentWord);
      if (idxWrong !== -1) {
        wrongStack.splice(idxWrong, 1);
      }
    }
    lastWord = currentWord;
    nextQuestion();
  } else {
    // Nếu sai, đánh dấu border cho ô tương ứng
    if (!wordIsRight) {
      wordInput.classList.add("error");
    }
    if (!typeIsRight) {
      typeInput.classList.add("error");
    }
    currentAttempt++;
    feedbackEl.textContent = "Sai! Mời thử lại.";
    feedbackEl.style.color = "red";
    wrongSound.play();
  }
}

function endQuiz() {
  vietnameseEl.textContent = "Kết thúc kiểm tra!";
  feedbackEl.textContent = `Điểm của bạn: ${score}`;
  wordInput.disabled = true;
  typeInput.disabled = true;
}