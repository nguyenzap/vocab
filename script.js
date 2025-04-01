// Vocabulary lists for each user
const vocabListKhanh = [
    {"word": "consultant", "type": "n", "vietnamese": "người tư vấn"},
    {"word": "abundant", "type": "adj", "vietnamese": "dồi dào, phong phú"},
    {"word": "resplendent", "type": "adj", "vietnamese": "rực rỡ, huy hoàng"},
    {"word": "dozen", "type": "n", "vietnamese": "một tá, hàng tá"},
    {"word": "constraint", "type": "n", "vietnamese": "sự ràng buộc, hạn chế"},
    {"word": "substantial", "type": "adj", "vietnamese": "đáng kể, lớn lao"},
    {"word": "enrich", "type": "v", "vietnamese": "làm giàu, làm phong phú"},
    {"word": "solely", "type": "adv", "vietnamese": "chỉ, duy nhất"},
    {"word": "agriculture", "type": "n", "vietnamese": "nông nghiệp"},
    {"word": "establish", "type": "v", "vietnamese": "thiết lập, thành lập"},
    {"word": "woodpecker", "type": "n", "vietnamese": "chim gõ kiến"},
    {"word": "diversity", "type": "n", "vietnamese": "sự đa dạng"},
    {"word": "retention", "type": "n", "vietnamese": "sự giữ lại, sự duy trì"},
    {"word": "vigorous", "type": "adj", "vietnamese": "mạnh mẽ, sôi nổi"},
    {"word": "accumulate", "type": "v", "vietnamese": "tích lũy, gom góp"},
    {"word": "associated", "type": "adj", "vietnamese": "liên quan, liên kết"},
    {"word": "phaonorthside", "type": "n", "vietnamese": "Phaonorthside (tên riêng)"},
    {"word": "prevalent", "type": "adj", "vietnamese": "phổ biến, thịnh hành"},
    {"word": "ruthlessness", "type": "n", "vietnamese": "sự tàn nhẫn"},
    {"word": "ostracise", "type": "v", "vietnamese": "xa lánh, khai trừ"},
    {"word": "egalitarianism", "type": "n", "vietnamese": "chủ nghĩa bình đẳng"},
    {"word": "altruism", "type": "n", "vietnamese": "lòng vị tha"},
    {"word": "hierarchical", "type": "adj", "vietnamese": "có tính phân cấp"},
    {"word": "bioactive", "type": "adj", "vietnamese": "có hoạt tính sinh học"},
    {"word": "ramification", "type": "n", "vietnamese": "hậu quả, hệ quả"},
    {"word": "unwillingly", "type": "adv", "vietnamese": "một cách miễn cưỡng"},
    {"word": "crucially", "type": "adv", "vietnamese": "một cách quan trọng"},
    {"word": "undoubtedly", "type": "adv", "vietnamese": "chắc chắn, không nghi ngờ"},
    {"word": "potentially", "type": "adv", "vietnamese": "có khả năng, tiềm năng"}
];

const vocabListThanh = [
  {"word": "prodigious", "type": "adj", "vietnamese": "phi thường, xuất sắc"},
  {"word": "radioactivity", "type": "n", "vietnamese": "sự phóng xạ"},
  {"word": "phenomenon", "type": "n", "vietnamese": "hiện tượng"},
  {"word": "remarkable", "type": "adj", "vietnamese": "đáng chú ý, phi thường"},
  {"word": "investment", "type": "n", "vietnamese": "khoản đầu tư"},
  {"word": "finance", "type": "v", "vietnamese": "tài trợ, cung cấp kinh phí"},
  {"word": "secondary", "type": "adj", "vietnamese": "thuộc cấp trung học"},
  {"word": "fulfilled", "type": "v", "vietnamese": "hoàn thành, thực hiện"},
  {"word": "examination", "type": "n", "vietnamese": "kỳ thi, bài kiểm tra"},
  {"word": "partnership", "type": "n", "vietnamese": "sự hợp tác"},
  {"word": "significance", "type": "n", "vietnamese": "tầm quan trọng"},
  {"word": "substance", "type": "n", "vietnamese": "chất, vật chất"},
  {"word": "discovery", "type": "n", "vietnamese": "sự khám phá, phát hiện"},
  {"word": "shaft", "type": "n", "vietnamese": "hố sâu, trục đào"},
  {"word": "structure", "type": "n", "vietnamese": "cấu trúc, công trình"},
  {"word": "prehistoric", "type": "adj", "vietnamese": "thuộc thời tiền sử"},
  {"word": "sediment", "type": "n", "vietnamese": "trầm tích"},
  {"word": "excavation", "type": "n", "vietnamese": "cuộc khai quật"},
  {"word": "complicated", "type": "adj", "vietnamese": "phức tạp"},
  {"word": "wedge", "type": "n", "vietnamese": "nêm (một mảnh gỗ hoặc kim loại dùng để chêm, cố định)"},
  {"word": "timber", "type": "n", "vietnamese": "gỗ xây dựng, gỗ kiến trúc"},
  {"word": "antiquity", "type": "n", "vietnamese": "thời cổ đại"},
  {"word": "deliberately", "type": "adv", "vietnamese": "một cách có chủ ý, cố tình"},
  {"word": "narrower", "type": "adj", "vietnamese": "hẹp hơn"},
  {"word": "audience", "type": "n", "vietnamese": "khán giả, người xem, người tiếp nhận thông tin"},
  {"word": "conference", "type": "n", "vietnamese": "hội nghị"},
  {"word": "perception", "type": "n", "vietnamese": "nhận thức, quan niệm"},
  {"word": "society", "type": "n", "vietnamese": "xã hội, cộng đồng"},
  {"word": "apparent", "type": "adj", "vietnamese": "rõ ràng, dễ thấy"},
  {"word": "reconstruction", "type": "n", "vietnamese": "sự tái tạo, sự phục dựng"},
  {"word": "assessment", "type": "n", "vietnamese": "sự đánh giá"},
  {"word": "hypothesis", "type": "n", "vietnamese": "giả thuyết"},
  {"word": "institution", "type": "n", "vietnamese": "tổ chức, cơ quan"},
  {"word": "provide", "type": "v", "vietnamese": "cung cấp"},
  {"word": "generous", "type": "adj", "vietnamese": "hào phóng"},
  {"word": "government", "type": "n", "vietnamese": "chính phủ"},
  {"word": "surgery", "type": "n", "vietnamese": "phẫu thuật"},
  {"word": "contact", "type": "v", "vietnamese": "liên lạc"},
  {"word": "helmsman", "type": "n", "vietnamese": "người lái tàu"},
  {"word": "equipment", "type": "n", "vietnamese": "thiết bị"},
  {"word": "involve", "type": "v", "vietnamese": "liên quan đến"},
  {"word": "condition", "type": "n", "vietnamese": "điều kiện"},
  {"word": "competence", "type": "n", "vietnamese": "năng lực, khả năng"},
  {"word": "technique", "type": "n", "vietnamese": "kỹ thuật"},
  {"word": "situation", "type": "n", "vietnamese": "tình huống"},
  {"word": "essential", "type": "adj", "vietnamese": "cần thiết, quan trọng"},
  {"word": "experience", "type": "n", "vietnamese": "kinh nghiệm"},
  {"word": "emergency", "type": "n", "vietnamese": "tình huống khẩn cấp"},
  {"word": "motivating", "type": "adj", "vietnamese": "tạo động lực"},
  {"word": "stormy", "type": "adj", "vietnamese": "bão tố, đầy sóng gió"},
  {"word": "actually", "type": "adv", "vietnamese": "thực ra"},
  {"word": "rewarding", "type": "adj", "vietnamese": "đáng giá, bổ ích"},
  {"word": "recycling", "type": "n", "vietnamese": "tái chế"},
  {"word": "presentation", "type": "n", "vietnamese": "bài thuyết trình"},
  {"word": "perhaps", "type": "adv", "vietnamese": "có lẽ"},
  {"word": "ordinary", "type": "adj", "vietnamese": "bình thường"},
  {"word": "pupil", "type": "n", "vietnamese": "học sinh"},
  {"word": "compare", "type": "v", "vietnamese": "so sánh"},
  {"word": "footwear", "type": "n", "vietnamese": "giày dép"},
  {"word": "high-heeled", "type": "adj", "vietnamese": "có gót cao"},
  {"word": "expensive", "type": "adj", "vietnamese": "đắt tiền"},
  {"word": "worn", "type": "adj", "vietnamese": "mòn, sờn"},
  {"word": "beginner", "type": "n", "vietnamese": "người mới bắt đầu"},
  {"word": "achievement", "type": "n", "vietnamese": "thành tựu"},
  {"word": "consider", "type": "v", "vietnamese": "coi là, xem như"},
  {"word": "previously", "type": "adv", "vietnamese": "trước đây"},
  {"word": "tournament", "type": "n", "vietnamese": "giải đấu"},
  {"word": "transformation", "type": "n", "vietnamese": "sự biến đổi"},
  {"word": "publicise", "type": "v", "vietnamese": "công bố, quảng bá"},
  {"word": "former", "type": "adj", "vietnamese": "trước đây, cũ"},
  {"word": "coaching", "type": "adj", "vietnamese": "liên quan đến huấn luyện"},
  {"word": "account", "type": "n", "vietnamese": "sự giải trình, lời giải thích"},
  {"word": "valuable", "type": "adj", "vietnamese": "có giá trị, quý giá"},
  {"word": "impact", "type": "n", "vietnamese": "tác động, ảnh hưởng"},
  {"word": "unnoticed", "type": "adj", "vietnamese": "không được chú ý"},
  {"word": "prefer", "type": "v", "vietnamese": "ưa thích, ưu tiên"},
  {"word": "consist", "type": "v", "vietnamese": "bao gồm, gồm có"},
  {"word": "cross", "type": "n", "vietnamese": "sợi ngang (trong dây vợt)"},
  {"word": "modification", "type": "n", "vietnamese": "sự điều chỉnh, thay đổi"},
  {"word": "string", "type": "n", "vietnamese": "dây (dùng trong vợt tennis)"},
  {"word": "underestimate", "type": "v", "vietnamese": "đánh giá thấp, coi thường"},
  {"word": "importance", "type": "n", "vietnamese": "tầm quan trọng"},
  {"word": "customise", "type": "v", "vietnamese": "tùy chỉnh, cá nhân hoá"},
  {"word": "category", "type": "n", "vietnamese": "loại, hạng mục"},
  {"word": "common", "type": "adj", "vietnamese": "phổ biến, thông thường"},
  {"word": "co-polyester", "type": "n", "vietnamese": "sợi tổng hợp co-polyester"},
  {"word": "revolutionise", "type": "v", "vietnamese": "cách mạng hoá, thay đổi căn bản"},
  {"word": "attribute", "type": "v", "vietnamese": "gán cho, cho rằng là"},
  {"word": "customisation", "type": "n", "vietnamese": "sự tùy chỉnh, cá nhân hoá"},
  {"word": "Portuguese", "type": "adj", "vietnamese": "người Bồ Đào Nha; của Bồ Đào Nha"},
  {"word": "great", "type": "adj", "vietnamese": "lớn, vĩ đại"},
  {"word": "replace", "type": "v", "vietnamese": "thay thế"},
  {"word": "professional", "type": "n", "vietnamese": "vận động viên chuyên nghiệp, chuyên gia"},
  {"word": "racket", "type": "n", "vietnamese": "vợt (tennis)"},
  {"word": "handle", "type": "n", "vietnamese": "tay cầm, cán"},
  {"word": "manufacturing", "type": "n", "vietnamese": "sản xuất, chế tạo"},
  {"word": "adjustment", "type": "n", "vietnamese": "sự điều chỉnh, thay đổi"},
  {"word": "itself", "type": "pron", "vietnamese": "chính nó"},
  {"word": "frame", "type": "n", "vietnamese": "khung (vợt tennis)"},
  {"word": "original", "type": "adj", "vietnamese": "ban đầu, nguyên bản"}
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
