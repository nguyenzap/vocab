const vocabListKhiem = [
   {"word": "establishment", "type": "n", "vietnamese": "sự thành lập"},
    {"word": "regulate", "type": "v", "vietnamese": "điều tiết, quản lý"},
    {"word": "oversee", "type": "v", "vietnamese": "giám sát"},
    {"word": "congested", "type": "adj", "vietnamese": "đông đúc, tắc nghẽn"},
    {"word": "procedure", "type": "n", "vietnamese": "thủ tục, quy trình"},
    {"word": "manually", "type": "adv", "vietnamese": "bằng tay, thủ công"},
    {"word": "purely", "type": "adv", "vietnamese": "thuần túy, hoàn toàn"},
    {"word": "rudimentary", "type": "adj", "vietnamese": "sơ khai, thô sơ"},
    {"word": "elsewhere", "type": "adv", "vietnamese": "ở nơi khác"},
    {"word": "recreational", "type": "adj", "vietnamese": "mang tính giải trí"},
    {"word": "vicinity", "type": "n", "vietnamese": "vùng lân cận"},
    {"word": "aviation", "type": "n", "vietnamese": "hàng không"},
    {"word": "commercial", "type": "adj", "vietnamese": "thương mại"},
    {"word": "operation", "type": "n", "vietnamese": "hoạt động, vận hành"},
    {"word": "govern", "type": "v", "vietnamese": "chi phối, điều chỉnh"},
    {"word": "roughly", "type": "adv", "vietnamese": "xấp xỉ, đại khái"},
    {"word": "municipal", "type": "adj", "vietnamese": "thuộc đô thị/thành phố"},
    {"word": "metropolitan", "type": "adj", "vietnamese": "thuộc đô thị lớn"},
    {"word": "compelling", "type": "adj", "vietnamese": "thuyết phục, hấp dẫn"},
    {"word": "genuine", "type": "adj", "vietnamese": "thật, xác thực"},
    {"word": "so", "type": "adv", "vietnamese": "đến mức, như vậy"},
    {"word": "far", "type": "adv", "vietnamese": "cho đến nay"},
    {"word": "suspect", "type": "v", "vietnamese": "nghi ngờ, cho rằng"},
    {"word": "detect", "type": "v", "vietnamese": "phát hiện"},
    {"word": "attitude", "type": "n", "vietnamese": "thái độ, quan điểm"},
    {"word": "telepathy", "type": "n", "vietnamese": "thần giao cách cảm"},
    {"word": "meditation", "type": "n", "vietnamese": "thiền định"},
    {"word": "indicate", "type": "v", "vietnamese": "chỉ ra, cho thấy"},
    {"word": "alter", "type": "v", "vietnamese": "thay đổi"},
    {"word": "drastically", "type": "adv", "vietnamese": "mạnh mẽ, đáng kể"},
    {"word": "trial", "type": "n", "vietnamese": "thử nghiệm"},
    {"word": "mechanism", "type": "n", "vietnamese": "cơ chế, cách thức"},
    {"word": "pose", "type": "v", "vietnamese": "đặt ra (vấn đề, khó khăn)"},
    {"word": "sealed", "type": "adj", "vietnamese": "kín, được niêm phong/cách ly"},
    {"word": "let", "type": "v", "vietnamese": "cho phép (ánh sáng/khí…) lọt vào"},
    {"word": "session", "type": "n", "vietnamese": "buổi (thí nghiệm/làm việc)"},
    {"word": "attempt", "type": "v", "vietnamese": "cố gắng"},
    {"word": "beam", "type": "v", "vietnamese": "truyền/phát (tín hiệu, hình ảnh)"},
    {"word": "implication", "type": "n", "vietnamese": "hàm ý/hệ quả kéo theo"},
    {"word": "reveal", "type": "v", "vietnamese": "tiết lộ, cho thấy"},
    {"word": "argument", "type": "n", "vietnamese": "lập luận"},
    {"word": "conventional", "type": "adj", "vietnamese": "truyền thống"},
    {"word": "rule out", "type": "phrv", "vietnamese": "loại trừ"},
    {"word": "clue", "type": "n", "vietnamese": "manh mối"},
    {"word": "reach", "type": "v", "vietnamese": "tới, truyền tới"},
    {"word": "outright", "type": "adj", "vietnamese": "trắng trợn/rõ ràng"},
    {"word": "fraud", "type": "n", "vietnamese": "sự gian lận, lừa đảo"},
    {"word": "disturbed", "type": "adj", "vietnamese": "lo ngại, băn khoăn"},
    {"word": "demand", "type": "v", "vietnamese": "đòi hỏi, yêu cầu"},
    {"word": "ignore", "type": "v", "vietnamese": "phớt lờ, bỏ qua"},
    {"word": "statistical", "type": "adj", "vietnamese": "thuộc thống kê"},
    {"word": "apparent", "type": "adj", "vietnamese": "rõ ràng, dễ thấy"},
    {"word": "seem", "type": "v", "vietnamese": "dường như"},
    {"word": "stem", "type": "v", "vietnamese": "bắt nguồn (từ)"},
    {"word": "plausible", "type": "adj", "vietnamese": "hợp lý, có vẻ đúng"},
    {"word": "already", "type": "adv", "vietnamese": "đã, sẵn"},
    {"word": "particularly", "type": "adv", "vietnamese": "đặc biệt là"},
    {"word": "eventually", "type": "adv", "vietnamese": "cuối cùng thì"},
    {"word": "existence", "type": "n", "vietnamese": "sự tồn tại"},
    {"word": "subject to", "type": "phrv", "vietnamese": "cho (ai/cái gì) trải qua (điều gì đó)"},
    {"word": "put down to", "type": "phrv", "vietnamese": "quy cho (cái gì đó)"},
       {"word": "present", "type": "v", "vietnamese": "trình bày"},
    {"word": "finding", "type": "n", "vietnamese": "phát hiện, kết quả nghiên cứu"},
    {"word": "extra", "type": "adj", "vietnamese": "thêm, bổ sung"},
    {"word": "funding", "type": "n", "vietnamese": "kinh phí, tài trợ"},
    {"word": "preference", "type": "n", "vietnamese": "sự ưa thích, lựa chọn"},
    {"word": "colleague", "type": "n", "vietnamese": "đồng nghiệp"},
    {"word": "refuse", "type": "v", "vietnamese": "từ chối"},
    {"word": "confidentiality", "type": "n", "vietnamese": "tính bảo mật"},
    {"word": "anticipate", "type": "v", "vietnamese": "dự đoán, mong đợi"},
    {"word": "unwillingness", "type": "n", "vietnamese": "sự không sẵn lòng"},
    {"word": "taken aback", "type": "phrv", "vietnamese": "bị bất ngờ, choáng váng"},
    {"word": "department", "type": "n", "vietnamese": "khoa, phòng ban"},
    {"word": "pull out", "type": "phrv", "vietnamese": "rút lui, bỏ cuộc"},
    {"word": "interview", "type": "v", "vietnamese": "phỏng vấn"},
    {"word": "reassurance", "type": "n", "vietnamese": "sự trấn an"},
    {"word": "traceable", "type": "adj", "vietnamese": "có thể truy ra, lần theo được"},
    {"word": "bizarre", "type": "adj", "vietnamese": "kỳ quái, kỳ lạ"},
    {"word": "substance", "type": "n", "vietnamese": "chất (hóa học; vật chất)"},
   {"word": "estate agent", "type": "n", "vietnamese": "nhân viên môi giới bất động sản"},
{"word": "consist of", "type": "phrv", "vietnamese": "bao gồm, gồm có"},
{"word": "per year", "type": "", "vietnamese": "mỗi năm, theo năm"},

{"word": "venue", "type": "n", "vietnamese": "địa điểm tổ chức sự kiện"},
{"word": "exhibition", "type": "n", "vietnamese": "cuộc triển lãm"},
{"word": "intend", "type": "v", "vietnamese": "dự định, có ý định"},
{"word": "get involved in", "type": "", "vietnamese": "tham gia/dính líu vào"},
{"word": "find", "type": "v", "vietnamese": "nhận thấy/cảm thấy (find + object + adj)"},
{"word": "wisely", "type": "adv", "vietnamese": "một cách khôn ngoan"},
{"word": "contract", "type": "n", "vietnamese": "hợp đồng"},
{"word": "acquisition", "type": "n", "vietnamese": "sự tiếp thu (kiến thức/kỹ năng)"},
{"word": "indigenous", "type": "adj", "vietnamese": "bản địa, thuộc thổ dân"},
{"word": "Portuguese", "type": "adj", "vietnamese": "thuộc về/tiếng Bồ Đào Nha"},

{"word": "spotlight", "type": "n", "vietnamese": "tiêu điểm (ánh đèn sân khấu)"},
{"word": "already", "type": "adv", "vietnamese": "đã, sớm hơn mong đợi"},
{"word": "actually", "type": "adv", "vietnamese": "thực ra, thật sự"},
{"word": "cater", "type": "v", "vietnamese": "cung cấp dịch vụ/đáp ứng nhu cầu"},
{"word": "enormous", "type": "adj", "vietnamese": "rất lớn, khổng lồ"},
{"word": "broadcast", "type": "n", "vietnamese": "chương trình phát sóng"},
{"word": "spectacular", "type": "adj", "vietnamese": "ngoạn mục, ấn tượng"},
{"word": "statement", "type": "n", "vietnamese": "bản tuyên bố, lời phát biểu"},
{"word": "combine", "type": "v", "vietnamese": "kết hợp"},
{"word": "agency", "type": "n", "vietnamese": "cơ quan, hãng dịch vụ"},
{"word": "whether", "type": "", "vietnamese": "liệu rằng, liệu có… hay không"},
{"word": "proper", "type": "adj", "vietnamese": "đúng mực, thích hợp"},
{"word": "demotivated", "type": "adj", "vietnamese": "mất động lực"},
{"word": "otherwise", "type": "adv", "vietnamese": "nếu không thì"},
{"word": "suspicious", "type": "adj", "vietnamese": "nghi ngờ, cảnh giác"},
{"word": "administration", "type": "n", "vietnamese": "công tác quản trị, ban quản lý"},
{"word": "definite", "type": "adj", "vietnamese": "chắc chắn, dứt khoát"},
   {"word": "molten", "type": "adj", "vietnamese": "nóng chảy"},
{"word": "mass", "type": "n", "vietnamese": "khối vật chất"},
{"word": "clear", "type": "adj", "vietnamese": "trong suốt"},
{"word": "flat", "type": "adj", "vietnamese": "phẳng"},
{"word": "unblemished", "type": "adj", "vietnamese": "không tì vết"},
{"word": "labour", "type": "n", "vietnamese": "lao động"},
{"word": "intensive", "type": "adj", "vietnamese": "cường độ cao"},
{"word": "squeeze", "type": "v", "vietnamese": "ép"},
{"word": "mangle", "type": "n", "vietnamese": "máy ép (con lăn)"},
{"word": "virtually", "type": "adv", "vietnamese": "hầu như"},
{"word": "thickness", "type": "n", "vietnamese": "độ dày"},
{"word": "mark", "type": "v", "vietnamese": "để lại vết"},
{"word": "coat", "type": "v", "vietnamese": "phủ bề mặt"},
{"word": "tint", "type": "v", "vietnamese": "nhuộm màu nhạt"},
{"word": "glass", "type": "n", "vietnamese": "kính"},
{"word": "eliminate", "type": "v", "vietnamese": "loại bỏ"},
{"word": "boil", "type": "v", "vietnamese": "sôi"},
{"word": "tin", "type": "n", "vietnamese": "thiếc"},
{"word": "concept", "type": "n", "vietnamese": "khái niệm"},
{"word": "guarantee", "type": "v", "vietnamese": "bảo đảm"},
{"word": "horizontal", "type": "adj", "vietnamese": "nằm ngang"},
{"word": "pour", "type": "v", "vietnamese": "đổ"},
{"word": "parallel", "type": "adj", "vietnamese": "song song"},
{"word": "settle", "type": "v", "vietnamese": "ổn định"},
{"word": "tension", "type": "n", "vietnamese": "sức căng (bề mặt)"},
{"word": "fortunate", "type": "adj", "vietnamese": "may mắn"},
{"word": "coincidence", "type": "n", "vietnamese": "sự trùng hợp"},
{"word": "convince", "type": "v", "vietnamese": "thuyết phục"},
{"word": "optical", "type": "adj", "vietnamese": "quang học"},
{"word": "refine", "type": "v", "vietnamese": "tinh luyện"},
{"word": "homogenise", "type": "v", "vietnamese": "làm đồng nhất"},
{"word": "simultaneously", "type": "adv", "vietnamese": "đồng thời"},
{"word": "relieve", "type": "v", "vietnamese": "làm giảm"},
{"word": "principle", "type": "n", "vietnamese": "nguyên lý"},
{"word": "mar", "type": "v", "vietnamese": "làm hỏng"},
{"word": "inclusion", "type": "n", "vietnamese": "tạp chất"},
{"word": "bubble", "type": "n", "vietnamese": "bọt khí"},
{"word": "inspection", "type": "n", "vietnamese": "kiểm tra"},
{"word": "occasionally", "type": "adv", "vietnamese": "thỉnh thoảng"},
{"word": "grain", "type": "n", "vietnamese": "hạt"},
{"word": "tremor", "type": "n", "vietnamese": "rung nhẹ"},
{"word": "ripple", "type": "n", "vietnamese": "gợn sóng"},
{"word": "reveal", "type": "v", "vietnamese": "phát hiện"},
{"word": "fault", "type": "n", "vietnamese": "lỗi"},
{"word": "upstream", "type": "adv", "vietnamese": "ở đầu quy trình"},
{"word": "flaw", "type": "n", "vietnamese": "khuyết tật"},
{"word": "unaided", "type": "adj", "vietnamese": "không được hỗ trợ"},
{"word": "downstream", "type": "adv", "vietnamese": "ở giai đoạn sau"},
{"word": "steer", "type": "v", "vietnamese": "điều khiển"},
{"word": "cutter", "type": "n", "vietnamese": "dao cắt"},
{"word": "pattern", "type": "n", "vietnamese": "mẫu (cắt)"},
{"word": "property", "type": "n", "vietnamese": "tính chất"},
{"word": "plant", "type": "n", "vietnamese": "nhà máy"},
{"word": "full-scale", "type": "adj", "vietnamese": "quy mô đầy đủ"},
{"word": "instant", "type": "adj", "vietnamese": "tức thì"},
{"word": "commercial", "type": "adj", "vietnamese": "thương mại"},
{"word": "improve", "type": "v", "vietnamese": "cải tiến"},
{"word": "detect", "type": "v", "vietnamese": "phát hiện"}
   ];


const vocab_truong = [
   {"word": "awareness", "type": "n", "vietnamese": "sự nhận thức"},
    {"word": "carbon footprint", "type": "n", "vietnamese": "tổng lượng phát thải khí CO2"},
    {"word": "resource", "type": "n", "vietnamese": "nguồn tài nguyên"},
    {"word": "efficiently", "type": "adv", "vietnamese": "một cách hiệu quả"},
    {"word": "eco-friendly", "type": "adj", "vietnamese": "thân thiện với môi trường"},
    {"word": "decompose", "type": "v", "vietnamese": "phân hủy"},
    {"word": "reusable", "type": "adj", "vietnamese": "có thể tái sử dụng"},
    {"word": "single-use", "type": "adj", "vietnamese": "dùng một lần"},
    {"word": "ecotourism", "type": "n", "vietnamese": "du lịch sinh thái"},
    {"word": "waste", "type": "n", "vietnamese": "rác thải"},
    {"word": "landfill", "type": "n", "vietnamese": "bãi rác"},
    {"word": "reuse", "type": "v", "vietnamese": "tái sử dụng"},
    {"word": "packaging", "type": "n", "vietnamese": "bao bì"},
    {"word": "container", "type": "n", "vietnamese": "hộp, gói, thùng chứa"},
    {"word": "recyclable", "type": "adj", "vietnamese": "có thể tái chế"},
    {"word": "cardboard", "type": "n", "vietnamese": "bia cứng"},
    {"word": "cardboard", "type": "adj", "vietnamese": "làm bằng bìa cứng"},
    {"word": "leftover", "type": "n", "vietnamese": "thức ăn thừa"},
    {"word": "contaminated", "type": "adj", "vietnamese": "nhiễm độc, nhiễm khuẩn"},
    {"word": "compost", "type": "n", "vietnamese": "phân hữu cơ"},
    {"word": "sort", "type": "v", "vietnamese": "phân loại"},
    {"word": "layer", "type": "n", "vietnamese": "tầng, lớp"},
    {"word": "household waste", "type": "n", "vietnamese": "rác thải sinh hoạt"},
    {"word": "fruit peel", "type": "n", "vietnamese": "vỏ hoa quả"},
    {"word": "pile", "type": "n", "vietnamese": "đống"},
    {"word": "recycle", "type": "v", "vietnamese": "tái chế"},
    {"word": "sustainable", "type": "adj", "vietnamese": "bền vững, thân thiện môi trường"},
    {"word": "release", "type": "v", "vietnamese": "thải ra"},
   {"word": "multicultural", "type": "adj", "vietnamese": "đa văn hóa"},
    {"word": "cultural diversity", "type": "n", "vietnamese": "đa dạng văn hóa"},
    {"word": "cuisine", "type": "n", "vietnamese": "ẩm thực"},
    {"word": "booth", "type": "n", "vietnamese": "gian hàng"},
    {"word": "spicy", "type": "adj", "vietnamese": "cay"},
    {"word": "autograph", "type": "n", "vietnamese": "chữ ký của người nổi tiếng"},
    {"word": "souvenir", "type": "n", "vietnamese": "đồ lưu niệm"},
    {"word": "tug of war", "type": "n", "vietnamese": "trò chơi kéo co"},
    {"word": "bamboo dancing", "type": "n", "vietnamese": "nhảy sạp"},
    {"word": "delicious", "type": "adj", "vietnamese": "ngon miệng"},
    {"word": "identity", "type": "n", "vietnamese": "bản sắc, đặc điểm nhận dạng"},
    {"word": "origin", "type": "n", "vietnamese": "nguồn gốc"},
    {"word": "popularity", "type": "n", "vietnamese": "sự phổ biến"},
    {"word": "festival", "type": "n", "vietnamese": "lễ hội"},
    {"word": "trend", "type": "n", "vietnamese": "xu hướng"},
    {"word": "custom", "type": "n", "vietnamese": "phong tục"},
    {"word": "mystery", "type": "n", "vietnamese": "điều bí ẩn"},
    {"word": "globalisation", "type": "n", "vietnamese": "toàn cầu hóa"},
    {"word": "connected", "type": "adj", "vietnamese": "kết nối"},
    {"word": "respect", "type": "n", "vietnamese": "khía cạnh"},
    {"word": "dish", "type": "n", "vietnamese": "món ăn"},
    {"word": "ingredient", "type": "n", "vietnamese": "nguyên liệu, thành phần"},
    {"word": "unique", "type": "adj", "vietnamese": "độc đáo"},
    {"word": "specialty", "type": "n", "vietnamese": "đặc sản"},
    {"word": "captivate", "type": "v", "vietnamese": "thu hút, lôi cuốn"},
    {"word": "cross-cultural", "type": "adj", "vietnamese": "giao thoa văn hóa"},
    {"word": "blend", "type": "v", "vietnamese": "pha trộn"},
    {"word": "reflect", "type": "v", "vietnamese": "phản ánh"},
    {"word": "richness", "type": "n", "vietnamese": "sự phong phú"},
    {"word": "appreciate", "type": "v", "vietnamese": "thưởng thức, trân trọng"},
    {"word": "lifestyle", "type": "n", "vietnamese": "lối sống"},
    {"word": "celebrate", "type": "v", "vietnamese": "tổ chức, ăn mừng"},
   {"word": "admire", "type": "v", "vietnamese": "ngưỡng mộ"},
    {"word": "volunteer", "type": "v", "vietnamese": "tình nguyện"},
    {"word": "army", "type": "n", "vietnamese": "quân đội"},
    {"word": "surgeon", "type": "n", "vietnamese": "bác sĩ phẫu thuật"},
    {"word": "resistance war", "type": "n", "vietnamese": "cuộc kháng chiến"},
    {"word": "diary", "type": "n", "vietnamese": "nhật ký"},
    {"word": "field hospital", "type": "n", "vietnamese": "bệnh viện dã chiến"},
    {"word": "account", "type": "n", "vietnamese": "câu chuyện"},
    {"word": "experience", "type": "n", "vietnamese": "trải nghiệm"},
    {"word": "enemy", "type": "n", "vietnamese": "kẻ thù"},
    {"word": "duty", "type": "n", "vietnamese": "nghĩa vụ, nhiệm vụ"},
    {"word": "hero", "type": "n", "vietnamese": "anh hùng"},
    {"word": "devote", "type": "v", "vietnamese": "cống hiến"},
    {"word": "youth", "type": "n", "vietnamese": "tuổi trẻ"},
    {"word": "death", "type": "n", "vietnamese": "cái chết"},
    {"word": "attend", "type": "v", "vietnamese": "đi học, tham dự"},
    {"word": "childhood", "type": "n", "vietnamese": "tuổi thơ ấu"},
    {"word": "marriage", "type": "n", "vietnamese": "cuộc hôn nhân"},
    {"word": "impressive", "type": "adj", "vietnamese": "đầy ấn tượng"},
    {"word": "achievement", "type": "n", "vietnamese": "thành tựu"},
    {"word": "biological", "type": "adj", "vietnamese": "ruột thịt"},
    {"word": "adopt", "type": "v", "vietnamese": "nhận con nuôi"},
    {"word": "bond", "type": "n", "vietnamese": "kết thân, kết nối"},
    {"word": "accessible", "type": "adj", "vietnamese": "dễ tiếp cận"},
    {"word": "touchscreen", "type": "n", "vietnamese": "màn hình cảm ứng"},
    {"word": "cutting-edge", "type": "adj", "vietnamese": "hiện đại"},
    {"word": "stylish", "type": "adj", "vietnamese": "kiểu cách"},
    {"word": "animated", "type": "adj", "vietnamese": "hoạt hình"},
    {"word": "blockbuster", "type": "n", "vietnamese": "phim bom tấn"},
    {"word": "diagnose", "type": "v", "vietnamese": "chẩn đoán"},
    {"word": "rare", "type": "adj", "vietnamese": "hiếm"},
    {"word": "cancer", "type": "n", "vietnamese": "ung thư"}
];

const vocab_cu3 = [
   {"word": "admire",       "type": "v",   "vietnamese": "ngưỡng mộ"},
    {"word": "volunteer",    "type": "v",   "vietnamese": "tình nguyện"},
    {"word": "army",         "type": "n",   "vietnamese": "quân đội"},
    {"word": "surgeon",      "type": "n",   "vietnamese": "bác sĩ phẫu thuật"},
    {"word": "resistance",   "type": "n",   "vietnamese": "sự kháng chiến"},
    {"word": "war",          "type": "n",   "vietnamese": "chiến tranh"},
    {"word": "diary",        "type": "n",   "vietnamese": "nhật ký"},
    {"word": "field",        "type": "n",   "vietnamese": "chiến trường"},
    {"word": "hospital",     "type": "n",   "vietnamese": "bệnh viện"},
    {"word": "account",      "type": "n",   "vietnamese": "câu chuyện"},
    {"word": "experience",   "type": "n",   "vietnamese": "trải nghiệm"},
    {"word": "enemy",        "type": "n",   "vietnamese": "kẻ thù"},
    {"word": "duty",         "type": "n",   "vietnamese": "nghĩa vụ"},
    {"word": "hero",         "type": "n",   "vietnamese": "anh hùng"},
    {"word": "devote",       "type": "v",   "vietnamese": "cống hiến"},
    {"word": "youth",        "type": "n",   "vietnamese": "tuổi trẻ"},
    {"word": "death",        "type": "n",   "vietnamese": "cái chết"},
    {"word": "attend",       "type": "v",   "vietnamese": "tham dự"},
    {"word": "childhood",    "type": "n",   "vietnamese": "tuổi thơ ấu"},
    {"word": "marriage",     "type": "n",   "vietnamese": "cuộc hôn nhân"},
    {"word": "impressive",   "type": "adj", "vietnamese": "ấn tượng"},
    {"word": "achievement",  "type": "n",   "vietnamese": "thành tựu"},
    {"word": "display",      "type": "n",   "vietnamese": "sự trưng bày"},
    {"word": "lobby",        "type": "n",   "vietnamese": "sảnh"},
    {"word": "back",         "type": "n",   "vietnamese": "mặt sau"},
    {"word": "brochure",     "type": "n",   "vietnamese": "tờ rơi"},
    {"word": "senior",       "type": "adj", "vietnamese": "lớn tuổi"},
    {"word": "avenue",       "type": "n",   "vietnamese": "đại lộ"},
    {"word": "bargain",      "type": "n",   "vietnamese": "món hời"},
   {"word": "proper", "type": "adj", "vietnamese": "đúng, phù hợp"},
    {"word": "strict", "type": "adj", "vietnamese": "nghiêm khắc"},
    {"word": "rule", "type": "n", "vietnamese": "quy tắc"},
    {"word": "obey", "type": "v", "vietnamese": "tuân theo"},
    {"word": "fragile", "type": "adj", "vietnamese": "dễ vỡ, mong manh"},
    {"word": "exhibit", "type": "v", "vietnamese": "trưng bày"},
    {"word": "hand", "type": "v", "vietnamese": "trao, đưa"},
    {"word": "out", "type": "adv", "vietnamese": "ra ngoài"},
    {"word": "interactive", "type": "adj", "vietnamese": "tương tác"},
    {"word": "layout", "type": "n", "vietnamese": "bố cục"},
    {"word": "sequence", "type": "n", "vietnamese": "trình tự"},
    {"word": "cetera", "type": "n", "vietnamese": "những thứ khác, v.v."},
    {"word": "proposal", "type": "n", "vietnamese": "đề xuất"},
    {"word": "ought to", "type": "v", "vietnamese": "nên, phải"},
    {"word": "order", "type": "n", "vietnamese": "trật tự, thứ tự"},
    {"word": "typo", "type": "n", "vietnamese": "lỗi đánh máy"},
    {"word": "knock", "type": "v", "vietnamese": "gõ, đập"},
    {"word": "cloakroom", "type": "n", "vietnamese": "phòng giữ áo mũ"},
    {"word": "insert", "type": "v", "vietnamese": "chèn vào"},
    {"word": "subheading", "type": "n", "vietnamese": "tiêu đề phụ"},
    {"word": "sake", "type": "n", "vietnamese": "mục đích, lợi ích"},
    {"word": "format", "type": "n", "vietnamese": "định dạng"},
   {"word": "description", "type": "n", "vietnamese": "sự mô tả"},  
{"word": "timekeeping", "type": "n", "vietnamese": "việc đo lường/ghi lại thời gian"},  
{"word": "invention", "type": "n", "vietnamese": "phát minh"},  
{"word": "equal", "type": "adj", "vietnamese": "bằng nhau"},  
{"word": "cabinet", "type": "n", "vietnamese": "tủ, hộp đựng"},  
{"word": "measure", "type": "v", "vietnamese": "đo lường"},  
{"word": "shadow", "type": "n", "vietnamese": "bóng, bóng râm"},  
{"word": "advent", "type": "n", "vietnamese": "sự xuất hiện, sự ra đời"},  
{"word": "satellite", "type": "n", "vietnamese": "vệ tinh"},  
{"word": "function", "type": "n", "vietnamese": "chức năng"},  
{"word": "existence", "type": "n", "vietnamese": "sự tồn tại"},  
{"word": "shape", "type": "n", "vietnamese": "hình dạng"},  
{"word": "permit", "type": "v", "vietnamese": "cho phép"},  
{"word": "pendulum", "type": "n", "vietnamese": "con lắc"},  
{"word": "split", "type": "v", "vietnamese": "chia, tách"},  
{"word": "commence", "type": "v", "vietnamese": "bắt đầu"},
    {"word": "communal", "type": "adj", "vietnamese": "chung, cộng đồng"},
    {"word": "shipment", "type": "n", "vietnamese": "việc vận chuyển"},
    {"word": "good", "type": "n", "vietnamese": "hàng hóa"},
    {"word": "harvest", "type": "v", "vietnamese": "thu hoạch"},
    {"word": "cycle", "type": "n", "vietnamese": "chu kỳ"},
    {"word": "orbit", "type": "v", "vietnamese": "quay quanh"},
    {"word": "adjust", "type": "v", "vietnamese": "điều chỉnh"},
    {"word": "maintain", "type": "v", "vietnamese": "duy trì"},
    {"word": "devise", "type": "v", "vietnamese": "phát minh, nghĩ ra"},
    {"word": "swing", "type": "v", "vietnamese": "đung đưa, dao động"},
    {"word": "anchor", "type": "n", "vietnamese": "mỏ neo"},
    {"word": "escapement", "type": "n", "vietnamese": "bộ thoát (trong đồng hồ)"},
    {"word": "lever", "type": "n", "vietnamese": "đòn bẩy, cần gạt"},
    {"word": "tooth", "type": "n", "vietnamese": "răng (bánh răng)"},
    {"word": "wheel", "type": "n", "vietnamese": "bánh xe, bánh răng"},
    {"word": "motion", "type": "n", "vietnamese": "chuyển động"},
    {"word": "rock", "type": "v", "vietnamese": "lắc, đung đưa"},
    {"word": "pendulum", "type": "n", "vietnamese": "con lắc"},
    {"word": "beat", "type": "v", "vietnamese": "dao động, nhịp"},
    {"word": "grandfather clock", "type": "n", "vietnamese": "đồng hồ quả lắc lớn kiểu cổ điển"},
    {"word": "accurate", "type": "adj", "vietnamese": "chính xác"},
    {"word": "integral", "type": "adj", "vietnamese": "không thể thiếu, cần thiết"},
    
    {"word": "Federal Aviation Administration", "type": "", "vietnamese": "Cục Hàng không Liên bang Mỹ"},
    {"word": "regulate", "type": "v", "vietnamese": "điều chỉnh, quy định"},
    {"word": "oversee", "type": "v", "vietnamese": "giám sát"},
    {"word": "operation", "type": "n", "vietnamese": "hoạt động, sự vận hành"},
    {"word": "aircraft", "type": "n", "vietnamese": "máy bay"},
    {"word": "quite", "type": "adv", "vietnamese": "khá, tương đối"},
    {"word": "congested", "type": "adj", "vietnamese": "đông đúc, tắc nghẽn"},
    {"word": "flight", "type": "n", "vietnamese": "chuyến bay"},
    {"word": "traffic", "type": "n", "vietnamese": "lưu lượng, giao thông"},
    {"word": "control", "type": "n", "vietnamese": "sự kiểm soát"},
    {"word": "advantage", "type": "n", "vietnamese": "lợi thế"},
    {"word": "communication", "type": "n", "vietnamese": "sự liên lạc"},
    {"word": "rudimentary", "type": "adj", "vietnamese": "thô sơ, sơ khai"},
    {"word": "full-scale", "type": "adj", "vietnamese": "toàn diện, quy mô đầy đủ"},
    {"word": "airspace", "type": "n", "vietnamese": "vùng trời, không phận"},
    {"word": "fortuitous", "type": "adj", "vietnamese": "tình cờ, ngẫu nhiên"},
    {"word": "jet", "type": "n", "vietnamese": "phản lực"},
    {"word": "engine", "type": "n", "vietnamese": "động cơ"},
    {"word": "margin", "type": "n", "vietnamese": "giới hạn, biên độ"},
    {"word": "consist", "type": "v", "vietnamese": "bao gồm"},
    {"word": "depart", "type": "v", "vietnamese": "rời đi, cất cánh"},
    {"word": "realise", "type": "v", "vietnamese": "nhận ra, nhận thức"},
    {"word": "element", "type": "n", "vietnamese": "yếu tố"},
    {"word": "put into effect", "type": "", "vietnamese": "thực thi, áp dụng"},
    {"word": "virtually", "type": "adv", "vietnamese": "hầu như, gần như"},
    {"word": "entire", "type": "adj", "vietnamese": "toàn bộ"},
    {"word": "blanket", "type": "v", "vietnamese": "bao phủ"},
    {"word": "vicinity", "type": "n", "vietnamese": "vùng lân cận"},
    {"word": "elsewhere", "type": "adv", "vietnamese": "nơi khác"},
    {"word": "recreational", "type": "adj", "vietnamese": "mang tính giải trí"},
    {"word": "while", "type": "n", "vietnamese": "khoảng thời gian ngắn"},
    {"word": "restriction", "type": "n", "vietnamese": "sự hạn chế"},
    {"word": "impose", "type": "v", "vietnamese": "áp đặt"},
    {"word": "below", "type": "adv", "vietnamese": "bên dưới"},
    {"word": "recognise", "type": "v", "vietnamese": "công nhận, nhận ra"},
    {"word": "reliance", "type": "n", "vietnamese": "sự phụ thuộc"},
    {"word": "navigational", "type": "adj", "vietnamese": "thuộc về định vị, dẫn đường"},
    {"word": "possess", "type": "v", "vietnamese": "sở hữu"},
    {"word": "above", "type": "adv", "vietnamese": "phía trên"},
    {"word": "beyond", "type": "adv", "vietnamese": "vượt quá"},
    {"word": "designate", "type": "v", "vietnamese": "chỉ định"},
    {"word": "letter", "type": "n", "vietnamese": "chữ cái"}
];
const vocab_cu1 = [
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
    {"word": "seminar", "type": "n", "vietnamese": "hội thảo"},
   {"word": "conquer", "type": "v", "vietnamese": "chinh phục"},
    {"word": "shipbuilder", "type": "n", "vietnamese": "thợ đóng tàu"},
    {"word": "lightweight", "type": "adj", "vietnamese": "nhẹ"},
    {"word": "enroll", "type": "v", "vietnamese": "gia nhập"},
    {"word": "military", "type": "n", "vietnamese": "quân đội"},
    {"word": "hull", "type": "n", "vietnamese": "thân tàu"},
    {"word": "sail", "type": "n", "vietnamese": "cánh buồm"},
    {"word": "rower", "type": "n", "vietnamese": "người chèo"},
    {"word": "quay", "type": "n", "vietnamese": "bến tàu"},
    {"word": "drag", "type": "v", "vietnamese": "kéo"},
    {"word": "craftsman", "type": "n", "vietnamese": "thợ thủ công"},
    {"word": "plank", "type": "n", "vietnamese": "tấm ván"},
    {"word": "dominate", "type": "v", "vietnamese": "thống trị"},
    {"word": "ensure", "type": "v", "vietnamese": "đảm bảo"},
    {"word": "merchant", "type": "adj", "vietnamese": "thương mại"},
    {"word": "ship", "type": "n", "vietnamese": "tàu"},
    {"word": "reveal", "type": "v", "vietnamese": "tiết lộ"},
    {"word": "ancient", "type": "adj", "vietnamese": "cổ đại"},
    {"word": "artefact", "type": "n", "vietnamese": "hiện vật"},
    {"word": "glacier", "type": "n", "vietnamese": "sông băng"},
    {"word": "shrink", "type": "v", "vietnamese": "co lại"},
   {"word": "vanish", "type": "v", "vietnamese": "biến mất"},
    {"word": "insight", "type": "n", "vietnamese": "hiểu biết sâu sắc"},
    {"word": "decay", "type": "n", "vietnamese": "sự phân hủy"},
    {"word": "swift", "type": "adj", "vietnamese": "nhanh chóng"},
    {"word": "degradation", "type": "n", "vietnamese": "sự hư hại, sự xuống cấp"},
    {"word": "approach", "type": "n", "vietnamese": "cách tiếp cận"},
    {"word": "fieldwork", "type": "n", "vietnamese": "công tác thực địa"},
    {"word": "period", "type": "n", "vietnamese": "thời kỳ"},
    {"word": "reindeer", "type": "n", "vietnamese": "tuần lộc"},
    {"word": "congregate", "type": "v", "vietnamese": "tụ tập"},
    {"word": "settlement", "type": "n", "vietnamese": "khu định cư"},
    {"word": "stationary", "type": "adj", "vietnamese": "cố định"},
    {"word": "amid", "type": "prep", "vietnamese": "ở giữa"},
    {"word": "boulder", "type": "n", "vietnamese": "tảng đá lớn"},
    {"word": "expose", "type": "v", "vietnamese": "để lộ, phơi bày"},
    {"word": "rewarding", "type": "adj", "vietnamese": "bổ ích, đáng công"},
    {"word": "melt", "type": "v", "vietnamese": "tan chảy"},
    {"word": "survey", "type": "v", "vietnamese": "khảo sát"},
    {"word": "fragile", "type": "adj", "vietnamese": "dễ vỡ, mong manh"},
    {"word": "shift", "type": "n", "vietnamese": "sự chuyển động"},
    {"word": "spread", "type": "n", "vietnamese": "sự lan rộng"},
    {"word": "recover", "type": "v", "vietnamese": "thu hồi, phục hồi"},
    {"word": "discovery", "type": "n", "vietnamese": "khám phá"},
    {"word": "overland", "type": "adj", "vietnamese": "đường bộ"},
    {"word": "along", "type": "prep", "vietnamese": "cùng với"},
    {"word": "demand", "type": "n", "vietnamese": "nhu cầu"},
    {"word": "antler", "type": "n", "vietnamese": "gạc (sừng hươu)"}
];
const vocab_cu2 = [ 
{"word": "regular", "type": "adj", "vietnamese": "đều đặn, thường xuyên"},
    {"word": "irregular", "type": "adj", "vietnamese": "không đều, không thường xuyên"},
    {"word": "bulk", "type": "n", "vietnamese": "số lượng lớn, khối lượng lớn"},
    {"word": "revenue", "type": "n", "vietnamese": "doanh thu, thu nhập"},
    {"word": "generate", "type": "v", "vietnamese": "tạo ra, phát sinh"},
    {"word": "amateur", "type": "n", "vietnamese": "(kẻ)nghiệp dư"},
    {"word": "reputation", "type": "n", "vietnamese": "danh tiếng"},
    {"word": "access", "type": "n", "vietnamese": "sự truy cập"},
    {"word": "acrobat", "type": "n", "vietnamese": "diễn viên xiếc nhào lộn"},
    {"word": "carpenter", "type": "n", "vietnamese": "thợ mộc"},
    {"word": "roundabout", "type": "n", "vietnamese": "bùng binh, vòng xuyến"},
    {"word": "junction", "type": "n", "vietnamese": "ngã ba/ngã tư, điểm giao nhau"},
    {"word": "entire", "type": "adj", "vietnamese": "toàn bộ"},
    {"word": "vogue", "type": "n", "vietnamese": "mốt, sự thịnh hành"},
    {"word": "urgent", "type": "adj", "vietnamese": "khẩn cấp"},
    {"word": "multi-storey", "type": "adj", "vietnamese": "nhiều tầng"},
    {"word": "construct", "type": "v", "vietnamese": "xây dựng"},
    {"word": "proponent", "type": "n", "vietnamese": "người ủng hộ"},
    {"word": "eventual", "type": "adj", "vietnamese": "cuối cùng"},
       {"word": "release", "type": "v", "vietnamese": "giải phóng, thải ra"},
    {"word": "stilt", "type": "n", "vietnamese": "cột chống (nhà sàn)"},
    {"word": "steep", "type": "adj", "vietnamese": "dốc"},
    {"word": "ventilation", "type": "n", "vietnamese": "sự thông gió"},
    {"word": "structure", "type": "n", "vietnamese": "kết cấu"},
    {"word": "airtight", "type": "adj", "vietnamese": "kín khí"},
    {"word": "industry", "type": "n", "vietnamese": "ngành công nghiệp"},
    {"word": "blame", "type": "v", "vietnamese": "đổ lỗi"},
    {"word": "widespread", "type": "adj", "vietnamese": "phổ biến, rộng rãi"},
    {"word": "superior", "type": "adj", "vietnamese": "vượt trội"},
    {"word": "reject", "type": "v", "vietnamese": "từ chối, bác bỏ"},
    {"word": "self-sufficient", "type": "adj", "vietnamese": "tự cung tự cấp"},
    {"word": "reflect away", "type": "v", "vietnamese": "phản xạ, phản chiếu (tia sáng)"},
    {"word": "ray", "type": "n", "vietnamese": "tia"},
    {"word": "slat", "type": "n", "vietnamese": "thanh lam, tấm bản mỏng"},
    {"word": "innovative", "type": "adj", "vietnamese": "mang tính sáng tạo, đổi mới"},
    {"word": "mould", "type": "v", "vietnamese": "nặn, đúc"},
    {"word": "insulator", "type": "n", "vietnamese": "chất cách nhiệt"},
    {"word": "rough", "type": "adj", "vietnamese": "thô ráp"},
    {"word": "frond", "type": "n", "vietnamese": "lá (cây dương xỉ, cọ)"},
    {"word": "eventual", "type": "adj", "vietnamese": "cuối cùng"},
       {"word": "acquire", "type": "v", "vietnamese": "tiếp thu, học được"},
    {"word": "cope", "type": "v", "vietnamese": "đối phó"},
    {"word": "frightening", "type": "adj", "vietnamese": "đáng sợ"},
    {"word": "physiological", "type": "adj", "vietnamese": "(thuộc) sinh lý"},
    {"word": "psychological", "type": "adj", "vietnamese": "(thuộc) tâm lý"},
    {"word": "compress", "type": "v", "vietnamese": "nén"},
    {"word": "insight", "type": "n", "vietnamese": "sự hiểu biết sâu sắc"},
    {"word": "span", "type": "n", "vietnamese": "khoảng thời gian"},
    {"word": "identify", "type": "v", "vietnamese": "nhận dạng, xác định"},
    {"word": "behavior", "type": "n", "vietnamese": "hành vi"},
    {"word": "determine", "type": "v", "vietnamese": "xác định, quyết định"},
    {"word": "proceed", "type": "v", "vietnamese": "tiến hành"},
    {"word": "stood", "type": "v", "vietnamese": "đứng (quá khứ)"},
    {"word": "cage", "type": "n", "vietnamese": "lồng"},
    {"word": "avoid", "type": "v", "vietnamese": "tránh"},
    {"word": "infant", "type": "n", "vietnamese": "trẻ sơ sinh"},
    {"word": "neutral", "type": "adj", "vietnamese": "trung lập"},
    {"word": "motionless", "type": "adj", "vietnamese": "bất động"},
    {"word": "encounter", "type": "v", "vietnamese": "gặp phải"},
    {"word": "condition", "type": "n", "vietnamese": "tình huống, điều kiện"},
    
       {"word": "hostile", "type": "adj", "vietnamese": "thù địch, hiếu chiến"},
    {"word": "overwhelm", "type": "v", "vietnamese": "làm choáng ngợp, áp đảo"},
    {"word": "terror", "type": "n", "vietnamese": "nỗi kinh hoàng, sự khiếp sợ"},
    {"word": "associate", "type": "v", "vietnamese": "liên kết, gắn với"},
    {"word": "obtain", "type": "v", "vietnamese": "đạt được, thu được"},
    {"word": "undergo", "type": "v", "vietnamese": "trải qua"},
    {"word": "cue", "type": "n", "vietnamese": "tín hiệu, dấu hiệu"},
    {"word": "elicit", "type": "v", "vietnamese": "gợi ra, khơi gợi"},
    {"word": "assume", "type": "v", "vietnamese": "cho rằng, giả định"},
    {"word": "emit", "type": "v", "vietnamese": "phát ra, bốc ra"},
    {"word": "deduce", "type": "v", "vietnamese": "suy ra, suy luận"},
    {"word": "regain", "type": "v", "vietnamese": "lấy lại, giành lại"},
    {"word": "closeness", "type": "n", "vietnamese": "sự gần gũi"},
    {"word": "extend", "type": "v", "vietnamese": "kéo dài, mở rộng"},
    {"word": "evoke", "type": "v", "vietnamese": "gợi lên"},
    {"word": "gesture", "type": "n", "vietnamese": "cử chỉ"},
    {"word": "cab", "type": "n", "vietnamese": "taxi"},
   {"word": "rent", "type": "n", "vietnamese": "thuê"},
    {"word": "hire", "type": "n", "vietnamese": "thuê"},
    {"word": "fear", "type": "n", "vietnamese": "sợ hãi"},
    {"word": "analysis", "type": "n", "vietnamese": "sự phân tích"},
    {"word": "treat", "type": "v", "vietnamese": "điều trị"},
    {"word": "solitary", "type": "adj", "vietnamese": "cô độc"},
    {"word": "peer", "type": "n", "vietnamese": "bạn cùng trang lứa"},
    {"word": "directly", "type": "adv", "vietnamese": "một cách trực tiếp"},
    {"word": "primate", "type": "n", "vietnamese": "động vật linh trưởng"},
    {"word": "gentle", "type": "adj", "vietnamese": "nhẹ nhàng"},
    {"word": "purse", "type": "v", "vietnamese": "mím (môi)"},
    {"word": "yearn", "type": "v", "vietnamese": "khao khát"},
    {"word": "spot", "type": "v", "vietnamese": "phát hiện"},
    {"word": "bark", "type": "v", "vietnamese": "sủa"},
    {"word": "force", "type": "v", "vietnamese": "ép buộc"},
    {"word": "submissive", "type": "adj", "vietnamese": "phục tùng"},
    {"word": "grimace", "type": "n", "vietnamese": "nét nhăn mặt"},
    {"word": "surmise", "type": "v", "vietnamese": "phỏng đoán"},
    {"word": "emerge", "type": "v", "vietnamese": "xuất hiện"},
    {"word": "critical", "type": "adj", "vietnamese": "then chốt"},
    {"word": "engage", "type": "v", "vietnamese": "tham gia"},
    {"word": "abdomen", "type": "n", "vietnamese": "bụng"}
]
// Hardcoded login credentials
const vocabLists = {
  truong: vocab_truong,
  khiem: vocabListKhiem,
   cu1: vocab_cu1,
   cu2: vocab_cu2,
   cu3: vocab_cu3
};

const credentials = {
  truong: "1234",
  khiem: "1234",
   cu1: "1234",
   cu2: "1234",
   cu3: "1234"
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











