const vocabListKhanh = [
   {"word": "demographic",   "type": "adj",  "vietnamese": "thuộc nhân khẩu học"},
    {"word": "trend",         "type": "n",    "vietnamese": "xu hướng"},
    {"word": "vogue",         "type": "n",    "vietnamese": "mốt; thịnh hành"},
    {"word": "accommodate",   "type": "v",    "vietnamese": "chứa đựng; đáp ứng"},
    {"word": "sacrifice",     "type": "v",    "vietnamese": "hi sinh"},
    {"word": "verdant",       "type": "adj",  "vietnamese": "xanh tươi"},
    {"word": "natural",       "type": "adj",  "vietnamese": "tự nhiên"},
    {"word": "ecozone",       "type": "n",    "vietnamese": "vùng sinh thái"},
    {"word": "semi-arid",     "type": "adj",  "vietnamese": "bán khô hạn"},
    {"word": "desert",        "type": "n",    "vietnamese": "sa mạc"},
    {"word": "monsoon",       "type": "n",    "vietnamese": "gió mùa"},
    {"word": "prohibitively", "type": "adv",  "vietnamese": "quá mức; (thường) đắt đỏ"},
    {"word": "aspiration",    "type": "n",    "vietnamese": "khát vọng"},
    {"word": "undoubted",     "type": "adj",  "vietnamese": "không thể nghi ngờ"},
    {"word": "detrimental",   "type": "adj",  "vietnamese": "có hại"},
    {"word": "dialogue",      "type": "n",    "vietnamese": "lời thoại"},
    {"word": "synchronous",   "type": "adj",  "vietnamese": "đồng bộ"},
    {"word": "asynchronous",  "type": "adj",  "vietnamese": "không đồng bộ"},
    {"word": "physiognomy",   "type": "n",    "vietnamese": "diện mạo (khuôn mặt)"},
    {"word": "gesture",       "type": "n",    "vietnamese": "cử chỉ"},
    {"word": "persona",       "type": "n",    "vietnamese": "nhân vật; (tính cách)"},
    {"word": "emerge",        "type": "v",    "vietnamese": "xuất hiện"},
    {"word": "banal",         "type": "adj",  "vietnamese": "tầm thường"},
    {"word": "intrinsic",     "type": "adj",  "vietnamese": "vốn có"},
    {"word": "interest",      "type": "n",    "vietnamese": "sự thú vị"},
    {"word": "inadequacy",    "type": "n",    "vietnamese": "sự thiếu sót"},
    {"word": "magnificent",   "type": "adj",  "vietnamese": "tráng lệ"},
    {"word": "portray",       "type": "v",    "vietnamese": "miêu tả"},
    {"word": "engage",        "type": "v",    "vietnamese": "thu hút"},
    {"word": "acknowledge",   "type": "v",    "vietnamese": "thừa nhận"},
    {"word": "nuance",        "type": "n",    "vietnamese": "sắc thái"},
    {"word": "depict",        "type": "v",    "vietnamese": "miêu tả"},
    {"word": "foreshadow",    "type": "v",    "vietnamese": "báo trước"},
    {"word": "salient",       "type": "adj",  "vietnamese": "nổi bật"},
    {"word": "comprise",      "type": "v",    "vietnamese": "bao gồm"}
];

const vocabListKhiem = [
    {"word": "drought", "type": "n", "vietnamese": "hạn hán"},
    {"word": "crop", "type": "n", "vietnamese": "cây trồng"},
    {"word": "herbicide", "type": "n", "vietnamese": "thuốc diệt cỏ"},
    {"word": "agricultural", "type": "adj", "vietnamese": "thuộc về nông nghiệp"},
    {"word": "tractor", "type": "n", "vietnamese": "máy kéo (nông nghiệp)"},
    {"word": "plough", "type": "n", "vietnamese": "cái cày"},
    {"word": "estimate", "type": "n", "vietnamese": "sự ước tính"},
    {"word": "method", "type": "n", "vietnamese": "phương pháp"},
    {"word": "implement", "type": "v", "vietnamese": "thực hiện, triển khai"},
    {"word": "sacrifice", "type": "v", "vietnamese": "hi sinh"},
    {"word": "horizontal", "type": "adj", "vietnamese": "theo chiều ngang"},
    {"word": "evolve", "type": "v", "vietnamese": "tiến hóa"},
    {"word": "artificial", "type": "adj", "vietnamese": "nhân tạo"},
    {"word": "light", "type": "n", "vietnamese": "ánh sáng"},
    {"word": "natural", "type": "adj", "vietnamese": "tự nhiên"},
    {"word": "overhead", "type": "adj", "vietnamese": "ở phía trên"},
    {"word": "aspiration", "type": "n", "vietnamese": "khát vọng"},
    {"word": "stack", "type": "v", "vietnamese": "xếp chồng"},
    {"word": "tray", "type": "n", "vietnamese": "khay"},
    {"word": "vertical", "type": "adj", "vietnamese": "theo chiều dọc"},
    {"word": "farming", "type": "n", "vietnamese": "sự canh tác"},
    {"word": "potential", "type": "adj", "vietnamese": "tiềm năng"},
    {"word": "advantage", "type": "n", "vietnamese": "lợi thế"},
    {"word": "probable", "type": "adj", "vietnamese": "có khả năng xảy ra"},
    {"word": "development", "type": "n", "vietnamese": "sự phát triển"},
    {"word": "infectious", "type": "adj", "vietnamese": "truyền nhiễm"},
    {"word": "disease", "type": "n", "vietnamese": "bệnh"},
    {"word": "urban", "type": "adj", "vietnamese": "thuộc đô thị"},
    {"word": "centre", "type": "n", "vietnamese": "trung tâm"}
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
  // letterHintEl.textContent = "";
  // typeHintEl.textContent = "";
  
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
  // No more “Gợi ý: ” prefix—just show the revealed letters.
  letterHintEl.textContent = correctWord.substring(0, hintIndex);
}

function showTypeHint() {
  // No more “Loại từ: ” prefix—just show the type itself (e.g. “n”, “v”, “adj”).
  typeHintEl.textContent = currentWord.type;
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
