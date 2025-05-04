// Vocabulary lists for each user
const vocabListKhanh = [
  {"word": "sophisticated",   "type": "adj", "vietnamese": "tinh vi; phức tạp"},
    {"word": "inhabit",         "type": "v",   "vietnamese": "cư trú"},
    {"word": "catastrophe",     "type": "n",   "vietnamese": "thảm hoạ"},
    {"word": "unsustainable",   "type": "adj", "vietnamese": "không bền vững"},
    {"word": "integrated",      "type": "adj", "vietnamese": "được tích hợp"},
    {"word": "infrastructure",  "type": "n",   "vietnamese": "cơ sở hạ tầng"},
    {"word": "canal",           "type": "n",   "vietnamese": "kênh đào"},
    {"word": "adjacent",        "type": "adj", "vietnamese": "liền kề"},
    {"word": "global",          "type": "adj", "vietnamese": "toàn cầu"},
    {"word": "crisis",          "type": "n",   "vietnamese": "khủng hoảng"},
    {"word": "cusp",            "type": "n",   "vietnamese": "bước ngoặt"},
    {"word": "revolutionise",   "type": "v",   "vietnamese": "cách mạng hoá"},
    {"word": "prominent",       "type": "adj", "vietnamese": "nổi bật"},
    {"word": "innovation",      "type": "n",   "vietnamese": "đổi mới"},
    {"word": "unconventional",  "type": "adj", "vietnamese": "phi truyền thống"},
    {"word": "hydraulic",       "type": "adj", "vietnamese": "thuỷ lực"},
    {"word": "ventilated",      "type": "adj", "vietnamese": "thông thoáng"},
    {"word": "elegant",         "type": "adj", "vietnamese": "thanh lịch"},
    {"word": "palace",          "type": "n",   "vietnamese": "cung điện"},
    {"word": "staggering",     "type": "adj", "vietnamese": "đáng kinh ngạc"},
    {"word": "wander",         "type": "v",   "vietnamese": "lang thang"},
    {"word": "predominantly",  "type": "adv", "vietnamese": "chủ yếu"},
    {"word": "resplendently",  "type": "adv", "vietnamese": "lộng lẫy"},
    {"word": "intensely",      "type": "adv", "vietnamese": "mãnh liệt"},
    {"word": "aromatic",       "type": "adj", "vietnamese": "thơm"},
    {"word": "sprout",         "type": "v",   "vietnamese": "mọc (mầm)"},
    {"word": "aubergine",      "type": "n",   "vietnamese": "cà tím"},
    {"word": "sustainable",    "type": "adj", "vietnamese": "bền vững"},
    {"word": "consultancy",    "type": "n",   "vietnamese": "dịch vụ tư vấn"},
    {"word": "flourish",       "type": "v",   "vietnamese": "phát triển mạnh"},
    {"word": "enquiry",        "type": "n",   "vietnamese": "yêu cầu thông tin"},
    {"word": "substantial",    "type": "adj", "vietnamese": "đáng kể"},
    {"word": "pesticide",      "type": "n",   "vietnamese": "thuốc trừ sâu"},
    {"word": "triumph",      "type": "n",   "vietnamese": "chiến thắng lớn; thành tựu vẻ vang"},
    {"word": "dense",        "type": "adj", "vietnamese": "dày đặc; khó hiểu"},
    {"word": "unshakable",   "type": "adj", "vietnamese": "vững chắc không thể lay chuyển"},
    {"word": "virtue",       "type": "n",   "vietnamese": "đức hạnh; phẩm chất đạo đức"},
    {"word": "destructive",  "type": "adj", "vietnamese": "gây hủy hoại"},
    {"word": "consoling",    "type": "adj", "vietnamese": "mang tính an ủi"},
    {"word": "resilience",   "type": "n",   "vietnamese": "khả năng phục hồi"},
    {"word": "profound",     "type": "adj", "vietnamese": "sâu sắc; thâm thúy"},
    {"word": "undertaking",  "type": "n",   "vietnamese": "công việc khó khăn"},
    {"word": "principle",   "type": "n", "vietnamese": "nguyên tắc"}
];

const vocabListThanh = [
  {"word": "sophisticated",   "type": "adj", "vietnamese": "tinh vi; phức tạp"},
    {"word": "inhabit",         "type": "v",   "vietnamese": "cư trú"},
    {"word": "catastrophe",     "type": "n",   "vietnamese": "thảm hoạ"},
    {"word": "unsustainable",   "type": "adj", "vietnamese": "không bền vững"},
    {"word": "integrated",      "type": "adj", "vietnamese": "được tích hợp"},
    {"word": "infrastructure",  "type": "n",   "vietnamese": "cơ sở hạ tầng"},
    {"word": "canal",           "type": "n",   "vietnamese": "kênh đào"},
    {"word": "adjacent",        "type": "adj", "vietnamese": "liền kề"},
    {"word": "global",          "type": "adj", "vietnamese": "toàn cầu"},
    {"word": "crisis",          "type": "n",   "vietnamese": "khủng hoảng"},
    {"word": "cusp",            "type": "n",   "vietnamese": "bước ngoặt"},
    {"word": "revolutionise",   "type": "v",   "vietnamese": "cách mạng hoá"},
    {"word": "prominent",       "type": "adj", "vietnamese": "nổi bật"},
    {"word": "innovation",      "type": "n",   "vietnamese": "đổi mới"},
    {"word": "unconventional",  "type": "adj", "vietnamese": "phi truyền thống"},
    {"word": "hydraulic",       "type": "adj", "vietnamese": "thuỷ lực"},
    {"word": "ventilated",      "type": "adj", "vietnamese": "thông thoáng"},
    {"word": "elegant",         "type": "adj", "vietnamese": "thanh lịch"},
    {"word": "palace",          "type": "n",   "vietnamese": "cung điện"}
];

// Hardcoded login credentials
const credentials = {
  khanh: "026895",
  thanh: "026318"
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
const hintBtn = document.getElementById("hint-btn");
const hintEl = document.getElementById("hint");
const feedbackEl = document.getElementById("feedback");
const skipBtn = document.getElementById("skip-btn");

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
                     (username === "thanh") ? vocabListThanh : [];
  startExam();
}

// Bind Enter key for login
usernameInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    loginFunction();
  }
});
passwordInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    loginFunction();
  }
});
loginBtn.addEventListener("click", loginFunction);

// Quiz event listeners
checkBtn.addEventListener("click", checkAnswer);
hintBtn.addEventListener("click", showHint);
skipBtn.addEventListener("click", skipQuestion);

// Bind Enter key for submitting the answer
wordInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    checkAnswer();
  }
});
typeInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    checkAnswer();
  }
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
  if (unseenWords.length === 0 && wrongStack.length === 0) {
    endQuiz();
    return;
  }
  
  // Choose next word (avoid repeating the last one if possible)
  let candidates = unseenWords.length > 0 ? unseenWords : wrongStack;
  if (candidates.length > 1 && lastWord) {
    candidates = candidates.filter(w => w !== lastWord);
  }
  
  currentWord = candidates[Math.floor(Math.random() * candidates.length)];
  
  // Remove from unseenWords if present
  const index = unseenWords.indexOf(currentWord);
  if (index !== -1) {
    unseenWords.splice(index, 1);
  }
  
  currentAttempt = 0;
  hintIndex = 0;
  vietnameseEl.textContent = `Nghĩa: ${currentWord.vietnamese}`;
  wordInput.value = "";
  typeInput.value = "";
  feedbackEl.textContent = "";
  hintEl.textContent = "Gợi ý: ";
  wordInput.focus();
}

function showHint() {
  const correctWord = currentWord.word;
  if (hintIndex < correctWord.length) {
    hintIndex++;
  }
  hintEl.textContent = `Gợi ý: ${correctWord.substring(0, hintIndex)} (${currentWord.type})`;
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
  
  if (userWord === correctWord && userType === correctType) {
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
      // Remove from wrongStack if present
      const idx = wrongStack.indexOf(currentWord);
      if (idx !== -1) {
        wrongStack.splice(idx, 1);
      }
    }
    lastWord = currentWord;
    nextQuestion();
  } else {
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
