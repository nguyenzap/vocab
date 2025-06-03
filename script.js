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
    {"word": "comprise",      "type": "v",    "vietnamese": "bao gồm"},
   {"word": "persistence", "type": "noun", "vietnamese": "sự dai dẳng"},
    {"word": "peril", "type": "noun", "vietnamese": "nguy hiểm"},
    {"word": "interpersonal", "type": "adj", "vietnamese": "giữa các cá nhân"},
    {"word": "inadvertently", "type": "adv", "vietnamese": "vô ý, không cố ý"},
    {"word": "distribute", "type": "verb", "vietnamese": "phân phối"},
    {"word": "widespread", "type": "adj", "vietnamese": "lan rộng, phổ biến"},
    {"word": "facilitate", "type": "verb", "vietnamese": "tạo điều kiện, làm cho thuận lợi"},
    {"word": "unduly", "type": "adv", "vietnamese": "quá đáng, không hợp lý"},
    {"word": "misperception", "type": "noun", "vietnamese": "nhận thức sai, hiểu sai"},
    {"word": "contemporary", "type": "adj", "vietnamese": "đương thời, hiện đại"},
    {"word": "warrant", "type": "verb", "vietnamese": "đòi hỏi, cần thiết"},
    {"word": "encounter", "type": "verb", "vietnamese": "gặp phải"},
    {"word": "counter", "type": "verb", "vietnamese": "phản bác, chống lại"},
    {"word": "tremendous", "type": "adj", "vietnamese": "to lớn, ghê gớm"},
    {"word": "subsequent", "type": "adj", "vietnamese": "tiếp theo, xảy ra sau"},
    {"word": "empirically", "type": "adv", "vietnamese": "theo cơ sở thực nghiệm"},
    {"word": "encode", "type": "verb", "vietnamese": "ghi nhận, mã hóa"},
    {"word": "momentarily", "type": "adv", "vietnamese": "trong chốc lát"},
    {"word": "reside", "type": "verb", "vietnamese": "nằm ở, cư trú"},
    {"word": "arduous", "type": "adj", "vietnamese": "gian khổ, khó khăn"}
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
    {"word": "centre", "type": "n", "vietnamese": "trung tâm"},
    {"word": "sort", "type": "n", "vietnamese": "loại"},
    {"word": "work", "type": "n", "vietnamese": "công việc"},
    {"word": "rest", "type": "n", "vietnamese": "phần còn lại"},
    {"word": "conversation", "type": "n", "vietnamese": "cuộc trò chuyện"},
    {"word": "special", "type": "adj", "vietnamese": "đặc biệt"},
    {"word": "clinic", "type": "n", "vietnamese": "phòng khám"},
    {"word": "branch", "type": "n", "vietnamese": "chi nhánh"},
    {"word": "devote", "type": "v", "vietnamese": "dành (thời gian), cống hiến"},
    {"word": "midday", "type": "n", "vietnamese": "giữa trưa"},
    {"word": "sign", "type": "v", "vietnamese": "ký tên"},
    {"word": "autograph", "type": "n", "vietnamese": "chữ ký"},
    {"word": "entrant", "type": "n", "vietnamese": "thí sinh, người tham gia"},
    {"word": "muscle", "type": "n", "vietnamese": "cơ bắp"},
    {"word": "tone", "type": "n", "vietnamese": "âm điệu, sắc thái"},
    {"word": "advert", "type": "n", "vietnamese": "quảng cáo, thông báo"},
    {"word": "whole", "type": "adj", "vietnamese": "toàn bộ"},
    {"word": "weekend", "type": "n", "vietnamese": "cuối tuần"},
    {"word": "section", "type": "n", "vietnamese": "phần, mục"},
    {"word": "appearance", "type": "n", "vietnamese": "ngoại hình, sự xuất hiện"},
    {"word": "modify", "type": "v", "vietnamese": "sửa đổi"},
    {"word": "manipulate", "type": "v", "vietnamese": "thao túng, vận dụng"},
    {"word": "realistic", "type": "adj", "vietnamese": "thực tế"},
    {"word": "situation", "type": "n", "vietnamese": "tình huống"},
    {"word": "handle", "type": "v", "vietnamese": "xử lý"},
    {"word": "dialogue", "type": "n", "vietnamese": "hội thoại"},
    {"word": "mismatch", "type": "n", "vietnamese": "sự không phù hợp"},
    {"word": "specific", "type": "adj", "vietnamese": "cụ thể"},
    {"word": "purpose", "type": "n", "vietnamese": "mục đích"},
    {"word": "centre", "type": "n", "vietnamese": "trung tâm"},
   {"word": "vacancy", "type": "n", "vietnamese": "vị trí bỏ trống"},
    {"word": "tutor", "type": "n", "vietnamese": "gia sư; người hướng dẫn"},
    {"word": "hostel", "type": "n", "vietnamese": "ký túc xá; nhà trọ"},
    {"word": "perk", "type": "n", "vietnamese": "đặc quyền; lợi ích phụ"},
    {"word": "referee", "type": "n", "vietnamese": "người giới thiệu"},
    {"word": "huge", "type": "adj", "vietnamese": "to lớn"},
    {"word": "cardiac", "type": "adj", "vietnamese": "(thuộc về) tim mạch"},
    {"word": "stock", "type": "n", "vietnamese": "cổ phiếu"},
    {"word": "oversea", "type": "adj", "vietnamese": "hải ngoại; ở nước ngoài"},
    {"word": "seminar", "type": "n", "vietnamese": "hội thảo"}
];
// Hardcoded login credentials
const credentials = {
  khanh: "1234",
  khiem: "1234"
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
  currentVocabList = (username === "khanh") ? vocabListKhanh : (username === "khiem") ? vocabListKhiem : [];
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
