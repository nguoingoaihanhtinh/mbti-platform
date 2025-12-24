-- ============================================
-- MBTI TYPES SEED DATA
-- Insert all 16 personality types
-- ============================================

INSERT INTO mbti_types (
    type_code, type_name, overview, strengths, weaknesses,
    career_recommendations, improvement_areas, workplace_needs,
    suitable_roles, communication_style, leadership_style
) VALUES
-- ISTJ - Người trách nhiệm
(
    'ISTJ',
    'Người trách nhiệm',
    'ISTJ là những người làm việc có phương pháp, đáng tin cậy và có trách nhiệm cao. Họ thích làm việc trong môi trường được tổ chức hợp lý, tôn trọng truyền thống và quy tắc.',
    ARRAY[
        'Đề xuất các hướng biến ý tưởng thành hiện thực',
        'Có tổ chức và chuẩn bị kỹ lưỡng',
        'Giữ vững trách nhiệm và hoàn tất công việc',
        'Duy trì sự tập trung vào những việc thực tế',
        'Đối xử công bằng với mọi người',
        'Có kiến thức kỹ thuật'
    ],
    ARRAY[
        'Có thể không truyền thông nhiều và có vẻ bị cách biệt',
        'Có thể không chuẩn bị kỹ lưỡng hoặc hoàn tất công việc một cách đúng đắn',
        'Có thể không nghĩ đủ về chiến lược cho những thay đổi cần thiết',
        'Có thể khó khăn trong việc chấp nhận sự thay đổi đột ngột'
    ],
    ARRAY[
        'Quản lý doanh nghiệp nhỏ', 'Kế toán', 'Quản lý', 'Cảnh sát',
        'Ngân hàng', 'Lái xe', 'Nha khoa', 'Các vị trí đòi hỏi tính chính xác và tuân thủ quy trình'
    ],
    ARRAY[
        'Học cách chia sẻ thông tin và quan điểm với người khác',
        'Học cách khen ngợi và cảm ơn người khác vì những nỗ lực của họ',
        'Phát triển tư duy dài hạn để tìm cách làm công việc tốt hơn',
        'Mở lòng hơn với những ý tưởng và phương pháp mới'
    ],
    ARRAY[
        'Được tự làm việc tùy thích',
        'Được tôn vinh và ghi nhận nỗ lực',
        'Môi trường có tổ chức, yên tĩnh và ổn định',
        'Có lý do chính đáng để làm theo cách khác'
    ],
    ARRAY['Quản lý chất lượng', 'Chuyên viên hành chính', 'Kế toán trưởng', 'Giám sát sản xuất'],
    'Trực tiếp, rõ ràng, dựa trên sự kiện và chi tiết cụ thể. Thích giao tiếp một-một hoặc trong nhóm nhỏ.',
    'Kiểu lãnh đạo theo hệ thống và có cấu trúc. Đặt ra các quy trình rõ ràng và kỳ vọng cụ thể. Tập trung vào trách nhiệm và hiệu suất công việc.'
),

-- ISFJ - Người bảo vệ
(
    'ISFJ',
    'Người bảo vệ',
    'ISFJ là những người làm việc có phương pháp, thân thiện và có tận tâm. Họ là những nhà tổ chức lịch thiệp, không có định kiến và là những người bảo vệ truyền thống.',
    ARRAY[
        'Hỗ trợ người khác một cách thực tế',
        'Có tổ chức và sẵn sàng đón nhận khó khăn',
        'Hoàn tất công việc',
        'Quan tâm đến từng chi tiết',
        'Chăm sóc khách hàng nói chung',
        'Tổ chức sự kiện',
        'Hỗ trợ đồng đội',
        'Mang năng lượng và tính cam kết đến với công việc'
    ],
    ARRAY[
        'Có thể không mạnh dạn thể hiện quan điểm nên không đóng góp được nhiều cho tập thể',
        'Có thể che dấu sai sót và không xử lý kịp thời',
        'Có thể quá khiêm tốn và tự trách mình nên không muốn nhận việc mới vì sợ sai sót',
        'Có thể tin người khác và ý kiến của họ quá mức',
        'Có thể không tư duy nhiều về tương lai và không nhìn thấy đại cục'
    ],
    ARRAY[
        'Công chức nhà nước', 'Y tá', 'Nhân viên xã hội',
        'Giáo viên tiểu học', 'Thư viện', 'Hành chính văn phòng',
        'Các công việc đòi hỏi sự tận tâm và quan tâm đến chi tiết'
    ],
    ARRAY[
        'Xây dựng niềm tin ở bản thân và ý thức được mình phải đóng góp gì cho tập thể',
        'Học cách đưa ra ý kiến phê bình khi cần thiết',
        'Học cách trở nên độc lập và quyết đoán hơn trong xử lý xung đột',
        'Phát triển tư duy chiến lược và tầm nhìn dài hạn'
    ],
    ARRAY[
        'Cảm thấy an toàn và được đánh giá cao',
        'Có cơ hội thể hiện sự tận tâm với người khác',
        'Môi trường làm việc ổn định với những nhiệm vụ rõ ràng',
        'Được ghi nhận và trân trọng cho những đóng góp của họ'
    ],
    ARRAY['Chăm sóc khách hàng', 'Hỗ trợ hành chính', 'Điều phối dự án', 'Quản lý văn phòng'],
    'Lịch thiệp, quan tâm đến cảm xúc người khác. Thích lắng nghe và hỗ trợ thực tế.',
    'Kiểu lãnh đạo chăm sóc, chú trọng đến nhu cầu cá nhân của nhân viên. Tạo môi trường làm việc an toàn và hỗ trợ.'
),

-- INFJ - Nhà tư vấn
(
    'INFJ',
    'Nhà tư vấn',
    'INFJ là những người rất quan tâm và giàu tưởng tượng. Họ tư duy sâu về mối quan hệ giữa công việc và con người, xây dựng những khung khái niệm phức tạp để giải thích những mối liên hệ này.',
    ARRAY[
        'Có một tầm nhìn mạnh mẽ về tương lai của tổ chức',
        'Đề xuất các cách tiếp cận mới để giải quyết vấn đề',
        'Nhạy bén trong việc nhận ra những bất hợp lý trong ý tưởng của người khác',
        'Quan tâm sâu sắc đến nhu cầu của mọi người',
        'Làm việc hiệu quả trong môi trường đòi hỏi sự sáng tạo và trực giác'
    ],
    ARRAY[
        'Có thể quá lý tưởng hóa và không thực tế đủ',
        'Có thể không chia sẻ nhiều và có vẻ bị cách biệt',
        'Có thể sẽ không sẵn sàng để tranh luận mạnh mẽ bảo vệ quan điểm của mình',
        'Có thể quá nhạy cảm với những lời chỉ trích'
    ],
    ARRAY[
        'Công chức nhà nước', 'Mỹ nghệ', 'Y dược', 'Kiến trúc',
        'Công tác xã hội', 'Tâm lý', 'Giảng dạy', 'Tư vấn',
        'Các công việc đòi hỏi sự sáng tạo và thấu hiểu con người'
    ],
    ARRAY[
        'Học cách thể hiện quan điểm và ý kiến của mình nhanh hơn',
        'Học cách đưa ra ý kiến phê bình và xử lý xung đột một cách quyết đoán hơn',
        'Giảm bớt nhu cầu đối với sự tuần tự và chắc chắn',
        'Học cách chấp nhận sự mơ hồ thiết yếu của cuộc sống'
    ],
    ARRAY[
        'Có cơ hội có một "tầm nhìn" và nhận thức về sứ mệnh',
        'Được làm việc trong môi trường giá trị đạo đức cao',
        'Có không gian riêng để suy ngẫm và phát triển ý tưởng',
        'Được tôn trọng cho những đóng góp độc đáo của họ'
    ],
    ARRAY['Tư vấn tâm lý', 'Nhà phân tích chiến lược', 'Huấn luyện viên', 'Nhà thiết kế trải nghiệm người dùng'],
    'Sâu sắc, có ý nghĩa, tập trung vào giá trị và tầm nhìn dài hạn. Nói ít nhưng có chiều sâu.',
    'Kiểu lãnh đạo khơi cảm hứng, tập trung vào phát triển tiềm năng của từng cá nhân và tạo ra tầm nhìn chung.'
),

-- INTJ - Nhà chiến lược
(
    'INTJ',
    'Nhà chiến lược',
    'INTJ là người độc lập với một tầm nhìn nội tại rõ ràng về thế giới bên ngoài. Họ thích những thách thức trí não, lớn lên từ việc tranh luận những tư tưởng mang tính lý thuyết và khái niệm.',
    ARRAY[
        'Tư duy chiến lược xuất sắc',
        'Khả năng phân tích sâu sắc và logic',
        'Độc lập trong công việc và ra quyết định',
        'Khả năng nhìn thấy "bức tranh toàn cảnh"',
        'Sẵn sàng thách thức các giả định hiện có',
        'Đề cao sự hiệu quả và năng suất'
    ],
    ARRAY[
        'Có thể quá cứng nhắc và không linh hoạt',
        'Có thể không chú ý đủ đến chi tiết thực thi',
        'Có thể tỏ ra lạnh lùng hoặc thiếu quan tâm đến cảm xúc của người khác',
        'Có thể không sẵn lòng lắng nghe ý kiến trái chiều'
    ],
    ARRAY[
        'Các vị trí quản lý cấp cao', 'Kiến trúc', 'Luật', 'Kỹ thuật',
        'Khoa học', 'Khoa học xã hội', 'Nghiên cứu', 'Tư vấn quản lý', 'Công nghệ thông tin'
    ],
    ARRAY[
        'Phát triển kỹ năng giao tiếp và làm việc nhóm',
        'Học cách lắng nghe và đánh giá cao quan điểm của người khác',
        'Cân bằng giữa tư duy lý thuyết và ứng dụng thực tiễn',
        'Mở lòng hơn với những ý tưởng và phương pháp mới'
    ],
    ARRAY[
        'Cơ hội được có một "hoài bão" lớn',
        'Môi trường tôn trọng tư duy độc lập và sáng tạo',
        'Được tự do phát triển và thực hiện các ý tưởng',
        'Có không gian riêng để suy ngẫm và làm việc'
    ],
    ARRAY['Nhà chiến lược', 'Kiến trúc sư hệ thống', 'Nhà nghiên cứu', 'Nhà phân tích kinh doanh'],
    'Trực tiếp, tập trung vào ý tưởng và khái niệm. Không thích giao tiếp xã giao, thích thảo luận sâu về các chủ đề phức tạp.',
    'Kiểu lãnh đạo tầm nhìn, tập trung vào hiệu quả và kết quả. Đặt tiêu chuẩn cao và kỳ vọng nhân viên có tư duy độc lập.'
),

-- ISTP - Thợ thủ công
(
    'ISTP',
    'Thợ thủ công',
    'ISTP là những người thực tế, thích ứng nhanh và có khả năng giải quyết vấn đề thực tế xuất sắc. Họ thích làm việc một mình, thích khám phá cách mọi thứ hoạt động và có tính cách điềm tĩnh.',
    ARRAY[
        'Giải quyết vấn đề, đặc biệt là những vấn đề đột xuất hoặc cần giải pháp tức thời',
        'Duy trì sự tập trung của tập thể vào những việc thực tế và có thể đạt được',
        'Đối xử với mọi người công bằng',
        'Có kiến thức kỹ thuật xuất sắc',
        'Cung cấp thông tin thực tiễn thích hợp để hỗ trợ hoàn thành công việc',
        'Khéo léo trong việc xử lý các tình huống phức tạp'
    ],
    ARRAY[
        'Có thể không truyền thông nhiều',
        'Có thể không chuẩn bị kỹ lưỡng hoặc hoàn tất công việc một cách đúng đắn',
        'Có thể không suy nghĩ đủ về chiến lược dài hạn',
        'Có thể tránh né các cuộc thảo luận về cảm xúc hoặc các vấn đề cá nhân'
    ],
    ARRAY[
        'Công an', 'Nông nghiệp', 'Cơ khí', 'Kỹ thuật', 'Thiết kế',
        'Các công việc đòi hỏi kỹ năng thực hành và giải quyết vấn đề nhanh chóng'
    ],
    ARRAY[
        'Học cách chia sẻ thông tin và quan điểm với người khác',
        'Phát triển kỹ năng lập kế hoạch dài hạn',
        'Cân bằng giữa hành động ngay lập tức và suy nghĩ chiến lược',
        'Chú ý hơn đến tác động của hành động lên người khác'
    ],
    ARRAY[
        'Có không gian và tự do hành động',
        'Được đánh giá cao cho kỹ năng thực tế và giải quyết vấn đề',
        'Môi trường linh hoạt, không gò bó bởi các quy tắc cứng nhắc',
        'Có cơ hội áp dụng kiến thức kỹ thuật vào thực tế'
    ],
    ARRAY['Kỹ thuật viên', 'Phi công', 'Thợ sửa chữa', 'Nhà phân tích hệ thống'],
    'Trực tiếp, ngắn gọn, tập trung vào giải pháp thực tế. Thích chia sẻ kinh nghiệm và kỹ năng cụ thể.',
    'Kiểu lãnh đạo thực tế, tập trung vào giải quyết vấn đề ngay lập tức. Tôn trọng sự độc lập và cho phép nhân viên tự do tìm cách hoàn thành công việc.'
),

-- ISFP - Nghệ sĩ
(
    'ISFP',
    'Nghệ sĩ',
    'ISFP là những người nhạy cảm, thân thiện và tốt bụng. Họ được dẫn dắt bởi những giá trị sâu sắc lấy con người làm trung tâm, hạnh phúc của người khác là quan trọng đối với họ.',
    ARRAY[
        'Quan tâm đến nhu cầu của mọi người và hỗ trợ họ một cách chân thành',
        'Linh hoạt và thích nghi nhanh với các tình huống mới',
        'Giỏi trong những công việc đòi hỏi quan tâm đến chi tiết',
        'Khéo léo trong việc ứng biến và giải quyết các tình huống bất ngờ',
        'Mang lại sự hòa hợp và cân bằng trong môi trường làm việc',
        'Có khả năng sáng tạo và thẩm mỹ tốt'
    ],
    ARRAY[
        'Có thể không chia sẻ quan điểm cá nhân đủ mạnh mẽ',
        'Có thể che dấu những khó khăn và không xử lý kịp thời',
        'Có thể quá khiêm tốn và tự phê bình, không dám nhận việc mới vì sợ làm sai',
        'Có thể tin tưởng người khác và quan điểm của họ quá mức',
        'Có thể thiếu tầm nhìn dài hạn và không nhìn thấy "bức tranh toàn cảnh"'
    ],
    ARRAY[
        'Điêu khắc', 'Nghệ thuật', 'Thiết kế', 'Y tá',
        'Công tác xã hội', 'Các ngành nghề đòi hỏi sự sáng tạo và thấu hiểu con người'
    ],
    ARRAY[
        'Xây dựng niềm tin ở bản thân và nhận thức rõ về những đóng góp của mình',
        'Học cách đưa ra phản hồi và phê bình khi cần thiết',
        'Phát triển kỹ năng ra quyết định và kiên định với các quyết định của mình',
        'Học cách cân bằng giữa quan tâm đến người khác và nhu cầu cá nhân'
    ],
    ARRAY[
        'Môi trường hòa nhã, tôn trọng lẫn nhau',
        'Có cơ hội thể hiện sự sáng tạo và cá tính',
        'Được làm việc độc lập hoặc trong nhóm nhỏ thân thiện',
        'Có thể đóng góp vào việc giúp đỡ người khác một cách thiết thực'
    ],
    ARRAY['Nhà thiết kế', 'Nghệ sĩ', 'Nhà trị liệu nghệ thuật', 'Chuyên viên hỗ trợ khách hàng'],
    'Mềm mại, đồng cảm, tập trung vào từng cá nhân. Thể hiện bản thân thông qua hành động hơn là lời nói.',
    'Kiểu lãnh đạo hòa hợp, tạo môi trường thoải mái để mọi người phát huy tối đa khả năng sáng tạo của mình.'
),

-- INFP - Người lý tưởng hóa
(
    'INFP',
    'Người lý tưởng hóa',
    'INFP là những người có tính cam kết cao, trung thành, và dứt khoát. Họ thích hình thành một tầm nhìn cho tương lai, và được dẫn dắt bởi những giá trị bản thân sâu sắc.',
    ARRAY[
        'Sáng tạo và có nhiều ý tưởng đổi mới',
        'Đáng tin cậy và trung thành với các nguyên tắc của họ',
        'Quan tâm sâu sắc đến sự phát triển của con người',
        'Linh hoạt và thích ứng với những thay đổi',
        'Có khả năng làm việc độc lập và tập trung cao độ',
        'Giỏi trong việc tìm kiếm ý nghĩa và mục đích trong công việc'
    ],
    ARRAY[
        'Có thể thiếu thực tế trong cách tiếp cận công việc',
        'Có thể trì hoãn hoặc mất quá nhiều thời gian chiêm nghiệm thay vì hành động',
        'Có thể trở nên quá lý tưởng hóa và thất vọng khi thực tế không như mong đợi',
        'Có thể khó khăn trong việc đưa ra phản hồi tiêu cực hoặc phê bình',
        'Có thể dễ bị tổn thương trước những lời chỉ trích'
    ],
    ARRAY[
        'Luật', 'Học thuật', 'Giảng dạy', 'Viết văn',
        'Công chức nhà nước', 'Tâm lý', 'Khoa học',
        'Các công việc cho phép họ thể hiện giá trị cá nhân và giúp đỡ người khác'
    ],
    ARRAY[
        'Học cách trở nên độc lập và quyết đoán hơn, đặc biệt khi xử lý xung đột và phê bình',
        'Trở nên có phương pháp hơn trong công việc',
        'Phát triển kỹ năng quản lý thời gian và hành động hiệu quả hơn',
        'Trở nên thực tế hơn và ít lý tưởng hóa hơn trong cuộc sống'
    ],
    ARRAY[
        'Cơ hội làm việc có ý nghĩa, phù hợp với giá trị cá nhân',
        'Môi trường tôn trọng sự độc lập và sáng tạo',
        'Có không gian riêng để suy ngẫm và phát triển ý tưởng',
        'Được làm việc với những người có cùng giá trị và tầm nhìn'
    ],
    ARRAY['Nhà văn', 'Nhà tư vấn', 'Nhà trị liệu', 'Nhà hoạt động xã hội'],
    'Thân thiện, chân thành, tập trung vào giá trị và ý nghĩa sâu sắc. Tránh xung đột và tìm kiếm sự hài hòa.',
    'Kiểu lãnh đạo lý tưởng, tập trung vào phát triển cá nhân và tạo ra môi trường làm việc có ý nghĩa.'
),

-- INTP - Nhà tư duy
(
    'INTP',
    'Nhà tư duy',
    'INTP là những người ít nói và dễ gần, với một tính cách tìm tòi trí tuệ đối với cuộc sống. Họ là những người độc lập, tự hình thành chính kiến của mình và có xu hướng mang tính học thuật và chiêm nghiệm.',
    ARRAY[
        'Tư duy phân tích sâu sắc và logic',
        'Khả năng giải quyết vấn đề phức tạp',
        'Sáng tạo trong việc đưa ra các giải pháp đổi mới',
        'Độc lập trong công việc và ra quyết định',
        'Là chuyên gia giỏi trong lĩnh vực chuyên môn của họ',
        'Tìm ra những sai sót trong suy nghĩ của mọi người thông qua đặt câu hỏi và thảo luận'
    ],
    ARRAY[
        'Có thể quá lý thuyết trong cách tiếp cận và thiếu quan tâm đến ứng dụng thực tiễn',
        'Có thể khó khăn trong việc truyền đạt ý tưởng phức tạp một cách đơn giản',
        'Có thể trì hoãn hành động để tiếp tục phân tích và hoàn thiện ý tưởng',
        'Có thể tỏ ra xa cách hoặc không quan tâm đến cảm xúc của người khác',
        'Có thể gặp khó khăn trong việc làm việc nhóm hoặc hợp tác'
    ],
    ARRAY[
        'Kiến trúc', 'CNTT', 'Khoa học', 'Triết học', 'Khoa học xã hội',
        'Giảng dạy', 'Mỹ thuật', 'Viết văn', 'Quản lý',
        'Các công việc đòi hỏi tư duy phân tích sâu sắc'
    ],
    ARRAY[
        'Học cách khen ngợi và cảm ơn người khác vì những nỗ lực của họ',
        'Chú ý hơn đến khía cạnh ứng dụng thực tiễn của những ý tưởng',
        'Học khi nào nên tránh những tranh luận trí tuệ để đạt sự hòa hợp với mọi người',
        'Phát triển kỹ năng giao tiếp và làm việc nhóm'
    ],
    ARRAY[
        'Cơ hội được làm việc với các khái niệm trừu tượng và ý tưởng phức tạp',
        'Được sử dụng tư duy logic để giải quyết các vấn đề',
        'Có không gian và thời gian để suy ngẫm trước khi hành động',
        'Môi trường làm việc cho phép tính độc lập và tự chủ'
    ],
    ARRAY['Nhà nghiên cứu', 'Nhà khoa học dữ liệu', 'Kiến trúc sư phần mềm', 'Nhà triết học'],
    'Logic, phân tích, tập trung vào ý tưởng hơn là con người. Thích tranh luận trí tuệ để làm rõ các khái niệm.',
    'Kiểu lãnh đạo tư duy, khuyến khích tư duy phản biện và sáng tạo. Cho phép nhân viên tự do khám phá các giải pháp.'
),

-- ESTP - Người thực thi
(
    'ESTP',
    'Người thực thi',
    'ESTP là những người năng động, thực tế và thích hành động. Họ thích sống trong hiện tại, thích nghi nhanh với các tình huống mới và giỏi trong việc giải quyết các vấn đề thực tế.',
    ARRAY[
        'Giải quyết vấn đề nhanh chóng và hiệu quả, đặc biệt trong các tình huống khẩn cấp',
        'Khả năng thích ứng cao với các thay đổi và tình huống mới',
        'Kỹ năng thuyết phục và thương lượng xuất sắc',
        'Thực tế và tập trung vào kết quả cụ thể',
        'Tạo ra năng lượng và sự hứng khởi trong môi trường làm việc',
        'Dễ dàng kết nối và xây dựng mối quan hệ với nhiều loại người khác nhau'
    ],
    ARRAY[
        'Có thể thiếu kiên nhẫn với các quy trình và thủ tục phức tạp',
        'Có thể tập trung quá nhiều vào hiện tại mà bỏ qua các kế hoạch dài hạn',
        'Có thể mạo hiểm quá mức trong việc đưa ra quyết định',
        'Có thể gặp khó khăn trong việc lắng nghe và xử lý các vấn đề cảm xúc phức tạp',
        'Có thể bỏ qua các chi tiết quan trọng khi vội vàng hành động'
    ],
    ARRAY[
        'Kinh doanh', 'Bán hàng', 'Marketing', 'Thể thao', 'Giải trí',
        'Các công việc đòi hỏi năng động và khả năng ứng biến nhanh chóng'
    ],
    ARRAY[
        'Phát triển tư duy chiến lược và lập kế hoạch dài hạn',
        'Học cách kiên nhẫn và chú ý đến các chi tiết quan trọng',
        'Cân bằng giữa hành động nhanh chóng và suy nghĩ kỹ lưỡng',
        'Phát triển kỹ năng lắng nghe và thấu hiểu cảm xúc của người khác'
    ],
    ARRAY[
        'Môi trường năng động, có nhiều thách thức và cơ hội mới',
        'Có cơ hội thể hiện kỹ năng thực hành và giải quyết vấn đề',
        'Được tự do hành động và ra quyết định nhanh chóng',
        'Có sự công nhận và thưởng cho kết quả đạt được'
    ],
    ARRAY['Đại diện kinh doanh', 'Doanh nhân', 'Huấn luyện viên', 'Nhà đàm phán'],
    'Năng động, thực tế, tập trung vào hành động và kết quả ngay lập tức. Thích thử thách và rủi ro có kiểm soát.',
    'Kiểu lãnh đạo hành động, tập trung vào kết quả và giải quyết vấn đề nhanh chóng. Dẫn dắt bằng ví dụ và sẵn sàng xông pha.'
),

-- ESFP - Người trình diễn
(
    'ESFP',
    'Người trình diễn',
    'ESFP là những người hướng ngoại, nhiệt tình và sống theo hiện tại. Họ thích được ở trung tâm của sự chú ý, thích những trải nghiệm mới mẻ và thú vị, và có khả năng tạo không khí vui vẻ.',
    ARRAY[
        'Tạo ra môi trường làm việc vui vẻ, năng động',
        'Khả năng thích ứng nhanh với các thay đổi và tình huống mới',
        'Kỹ năng giao tiếp và kết nối tuyệt vời',
        'Tập trung vào giải pháp thực tế và khả thi',
        'Quan tâm đến nhu cầu và cảm xúc của người khác',
        'Mang lại năng lượng và sự nhiệt huyết cho nhóm'
    ],
    ARRAY[
        'Có thể thiếu kiên nhẫn với các kế hoạch dài hạn và quy trình phức tạp',
        'Có thể tập trung quá nhiều vào hiện tại mà bỏ qua các kế hoạch tương lai',
        'Có thể gặp khó khăn trong việc làm việc độc lập hoặc trong môi trường yên tĩnh',
        'Có thể khó khăn trong việc đưa ra quyết định khó khăn hoặc phê bình',
        'Có thể dễ dàng bị phân tâm bởi những cơ hội mới hấp dẫn'
    ],
    ARRAY[
        'Các công việc liên quan đến dịch vụ khách hàng', 'Giảng dạy (đặc biệt là mẫu giáo và nhà trẻ)',
        'Thiết kế', 'Công nghiệp thực phẩm', 'Sáng tạo', 'Giải trí', 'Thư ký', 'Giám sát', 'Thủ thư', 'Vận chuyển'
    ],
    ARRAY[
        'Phát triển tư duy chiến lược và lập kế hoạch dài hạn',
        'Học cách kiên nhẫn với các quy trình và thủ tục',
        'Cân bằng giữa việc tận hưởng hiện tại và chuẩn bị cho tương lai',
        'Phát triển kỹ năng ra quyết định khó khăn và đưa ra phản hồi trung thực'
    ],
    ARRAY[
        'Có thể tự xoay xở và không gò bó',
        'Được động viên, cảm thấy hữu ích và được đánh giá cao',
        'Môi trường vui vẻ, đa dạng và có cơ hội giao tiếp xã hội',
        'Có thể cần được động viên để chiêm nghiệm nhiều hơn'
    ],
    ARRAY['Nhân viên sự kiện', 'Giáo viên mầm non', 'Huấn luyện viên cá nhân', 'Đại diện thương hiệu'],
    'Nhiệt tình, cởi mở, tập trung vào trải nghiệm chung. Thích chia sẻ câu chuyện và tạo không khí vui vẻ.',
    'Kiểu lãnh đạo năng động, tạo động lực thông qua sự nhiệt huyết và quan tâm đến từng cá nhân trong nhóm.'
),

-- ENFP - Người khơi nguồn cảm hứng
(
    'ENFP',
    'Người khơi nguồn cảm hứng',
    'ENFP là những người nhiệt huyết, sáng tạo và có tầm nhìn. Họ thích khám phá các khả năng mới, quan tâm đến con người và các ý tưởng, có khả năng truyền cảm hứng cho người khác.',
    ARRAY[
        'Sáng tạo và có nhiều ý tưởng đổi mới',
        'Nhiệt tình và có khả năng truyền cảm hứng cho người khác',
        'Linh hoạt và thích ứng nhanh với các thay đổi',
        'Quan tâm sâu sắc đến sự phát triển của con người',
        'Khả năng kết nối các khái niệm khác nhau để tạo ra giải pháp mới',
        'Giỏi trong việc nhìn thấy tiềm năng trong người khác và các tình huống'
    ],
    ARRAY[
        'Có thể không hoàn thành các dự án khi đã tìm thấy ý tưởng mới hấp dẫn hơn',
        'Có thể thiếu tập trung vào chi tiết và thực thi',
        'Có thể khó khăn trong việc đưa ra quyết định khó khăn khi nó ảnh hưởng đến người khác',
        'Có thể dễ dàng bị phân tâm bởi quá nhiều ý tưởng và cơ hội',
        'Có thể thiếu kiên nhẫn với các quy trình và thủ tục phức tạp'
    ],
    ARRAY[
        'Luật', 'Hoạt động xã hội', 'Giảng dạy', 'Nghệ thuật',
        'Marketing', 'Báo chí', 'Nhà văn', 'Khoa học', 'Công chức', 'Âm nhạc'
    ],
    ARRAY[
        'Bỏ đi những ý tưởng hay quá sớm để tập trung vào những đề án có vẻ dễ thành công hơn',
        'Dành nhiều thời gian chuẩn bị hơn và ít phụ thuộc vào bản năng',
        'Quan tâm nhiều hơn đến cảm xúc của người khác',
        'Học cách ghi nhận và cảm ơn người khác về những nỗ lực của họ và trở nên ít cạnh tranh hơn',
        'Nghe nhiều hơn và nói ít lại'
    ],
    ARRAY[
        'Động viên, đánh giá và hỗ trợ từ cấp trên',
        'Cơ hội phát triển cá nhân và nghề nghiệp',
        'Môi trường làm việc thân thiện, có tính xã hội cao',
        'Công việc có ý nghĩa, có tác động tích cực đến cuộc sống của người khác'
    ],
    ARRAY['Nhà sáng tạo nội dung', 'Huấn luyện viên', 'Nhà tư vấn', 'Giảng viên đào tạo'],
    'Nhiệt huyết, đầy cảm hứng, tập trung vào khả năng và tiềm năng. Thích khám phá các ý tưởng mới và tạo động lực cho người khác.',
    'Kiểu lãnh đạo truyền cảm hứng, tập trung vào việc khơi dậy tiềm năng của từng thành viên và tạo ra tầm nhìn chung.'
),

-- ENTP - Người có tầm nhìn
(
    'ENTP',
    'Người có tầm nhìn',
    'ENTP là những nhà tư tưởng sáng tạo, thích tranh luận và khám phá các ý tưởng mới. Họ có khả năng nhìn thấy các kết nối và khả năng mà người khác có thể bỏ lỡ.',
    ARRAY[
        'Tư duy sáng tạo và đổi mới',
        'Khả năng tranh luận và thuyết phục xuất sắc',
        'Dễ dàng thích ứng với các thay đổi và tình huống mới',
        'Khả năng nhìn thấy nhiều khía cạnh và giải pháp cho một vấn đề',
        'Giỏi trong việc đưa ra các ý tưởng và chiến lược mới',
        'Thích thách thức các giả định hiện có và tìm kiếm cách tiếp cận mới'
    ],
    ARRAY[
        'Có thể thiếu kiên nhẫn với các chi tiết và quy trình thực thi',
        'Có thể bỏ qua các dự án khi đã tìm thấy ý tưởng mới hấp dẫn hơn',
        'Có thể gặp khó khăn trong việc đưa ra quyết định cuối cùng',
        'Có thể tỏ ra tranh luận quá mức hoặc thách thức không cần thiết',
        'Có thể thiếu tập trung vào các mục tiêu dài hạn'
    ],
    ARRAY[
        'Nhiếp ảnh', 'Tâm lý học', 'Marketing', 'Doanh nhân',
        'Tư vấn quản lý', 'Chính trị', 'Nhà báo', 'Giảng dạy', 'Khoa học', 'Kỹ thuật', 'CNTT'
    ],
    ARRAY[
        'Học cách theo đuổi các dự án đến khi hoàn thành',
        'Dành thời gian quan tâm đến chi tiết thực hiện',
        'Phát triển kỹ năng lắng nghe và thấu hiểu quan điểm của người khác',
        'Cân bằng giữa sự đổi mới và thực tế trong công việc',
        'Học cách chấp nhận và làm việc trong các môi trường có cấu trúc'
    ],
    ARRAY[
        'Có cơ hội thể hiện sự thông minh và năng lực',
        'Có điều kiện cho nhiều lựa chọn, nhiều hướng giải quyết khác nhau',
        'Được tự do tranh luận và đưa ra các ý tưởng mới',
        'Được làm việc với những người có chuyên môn cao'
    ],
    ARRAY['Nhà chiến lược', 'Nhà phát minh', 'Nhà đàm phán', 'Cố vấn đổi mới'],
    'Tranh luận, thách thức, tập trung vào ý tưởng và khả năng. Thích tranh luận trí tuệ để tìm ra giải pháp tối ưu.',
    'Kiểu lãnh đạo đổi mới, khuyến khích tranh luận lành mạnh và tư duy phản biện. Tập trung vào việc tìm kiếm giải pháp sáng tạo cho các vấn đề phức tạp.'
),

-- ESTJ - Người quản lý
(
    'ESTJ',
    'Người quản lý',
    'ESTJ là những người thực tế, có tổ chức và thích làm việc theo hệ thống. Họ đánh giá cao hiệu quả, tuân thủ các quy tắc và truyền thống, có khả năng lãnh đạo tự nhiên.',
    ARRAY[
        'Khả năng tổ chức và quản lý xuất sắc',
        'Tập trung vào kết quả và hiệu suất',
        'Tuân thủ các quy tắc và chuẩn mực',
        'Khả năng ra quyết định nhanh chóng và dứt khoát',
        'Đáng tin cậy và có trách nhiệm cao',
        'Giỏi trong việc thiết lập cấu trúc và hệ thống làm việc'
    ],
    ARRAY[
        'Có thể thiếu linh hoạt khi đối mặt với thay đổi',
        'Có thể quá cứng nhắc trong việc tuân thủ các quy tắc',
        'Có thể gặp khó khăn trong việc chấp nhận các quan điểm khác biệt',
        'Có thể thiếu nhạy cảm với cảm xúc và nhu cầu cá nhân của người khác',
        'Có thể thiếu sáng tạo và đổi mới trong cách tiếp cận vấn đề'
    ],
    ARRAY[
        'Quản lý doanh nghiệp', 'Hành chính', 'Tài chính', 'Luật', 'Quân đội',
        'Các vị trí đòi hỏi tổ chức và quản lý hiệu quả'
    ],
    ARRAY[
        'Phát triển sự linh hoạt và cởi mở với các ý tưởng mới',
        'Học cách lắng nghe và thấu hiểu các quan điểm khác biệt',
        'Cân bằng giữa tuân thủ quy tắc và sáng tạo trong giải quyết vấn đề',
        'Phát triển kỹ năng thấu hiểu cảm xúc và nhu cầu của người khác'
    ],
    ARRAY[
        'Môi trường có cấu trúc rõ ràng với các mục tiêu xác định',
        'Được công nhận cho năng lực tổ chức và quản lý',
        'Có cơ hội thể hiện kỹ năng lãnh đạo và ra quyết định',
        'Môi trường tôn trọng các quy tắc và truyền thống'
    ],
    ARRAY['Quản lý dự án', 'Giám đốc điều hành', 'Chuyên viên tuân thủ', 'Quản lý bộ phận'],
    'Trực tiếp, rõ ràng, tập trung vào sự kiện và kết quả. Thích đưa ra các quy tắc và kỳ vọng rõ ràng.',
    'Kiểu lãnh đạo có trật tự, tập trung vào việc thiết lập hệ thống và quy trình hiệu quả. Đặt ra các tiêu chuẩn cao và kỳ vọng nhân viên tuân thủ.'
),

-- ESFJ - Người chăm sóc
(
    'ESFJ',
    'Người chăm sóc',
    'ESFJ là những người ấm áp, chu đáo và có định hướng xã hội mạnh mẽ. Họ quan tâm sâu sắc đến hạnh phúc và phúc lợi của người khác, thích tạo ra sự hài hòa trong các mối quan hệ.',
    ARRAY[
        'Chăm sóc khách hàng xuất sắc',
        'Khả năng tổ chức và hoàn tất công việc',
        'Tạo ra môi trường làm việc hòa nhã và hợp tác',
        'Quan tâm đến nhu cầu và cảm xúc của đồng nghiệp',
        'Đáng tin cậy và có trách nhiệm cao',
        'Giỏi trong việc xây dựng và duy trì các mối quan hệ'
    ],
    ARRAY[
        'Có thể quá quan tâm đến ý kiến của người khác',
        'Có thể gặp khó khăn trong việc đưa ra quyết định khó khăn khi nó ảnh hưởng đến hòa khí',
        'Có thể thiếu kiên nhẫn với những người có phong cách làm việc khác biệt',
        'Có thể tập trung quá nhiều vào việc làm hài lòng người khác mà bỏ qua mục tiêu công việc',
        'Có thể khó khăn trong việc chấp nhận những lời chỉ trích'
    ],
    ARRAY[
        'Các công việc trong lĩnh vực dịch vụ', 'Chăm sóc sức khỏe',
        'Giáo dục', 'Hành chính', 'Nhân sự',
        'Các vị trí đòi hỏi kỹ năng giao tiếp và quan tâm đến người khác'
    ],
    ARRAY[
        'Học cách đưa ra quyết định dựa trên tiêu chí khách quan thay vì chỉ dựa trên sự hài lòng của người khác',
        'Phát triển khả năng chấp nhận và xử lý những lời chỉ trích một cách xây dựng',
        'Cân bằng giữa quan tâm đến người khác và hoàn thành mục tiêu công việc',
        'Phát triển tư duy độc lập và tự tin hơn trong việc đưa ra quan điểm cá nhân'
    ],
    ARRAY[
        'Môi trường có cấu trúc rõ ràng với các kỳ vọng được xác định',
        'Được công nhận và đánh giá cao cho những đóng góp của họ',
        'Có cơ hội xây dựng và duy trì các mối quan hệ tích cực',
        'Môi trường làm việc hòa nhã, tôn trọng lẫn nhau'
    ],
    ARRAY['Quản lý nhân sự', 'Nhân viên hỗ trợ khách hàng', 'Điều phối viên sự kiện', 'Giáo viên'],
    'Hòa nhã, quan tâm, tập trung vào nhu cầu của người khác. Thích tạo dựng mối quan hệ và duy trì hòa khí trong nhóm.',
    'Kiểu lãnh đạo hỗ trợ, tập trung vào việc tạo ra môi trường làm việc hòa hợp và quan tâm đến phúc lợi của từng thành viên.'
),

-- ENFJ - Người chỉ đạo
(
    'ENFJ',
    'Người chỉ đạo',
    'ENFJ là những người có tầm nhìn, có khả năng lãnh đạo tự nhiên và quan tâm đến việc phát triển tiềm năng của người khác. Họ có khả năng giao tiếp xuất sắc, dễ dàng kết nối với người khác.',
    ARRAY[
        'Khả năng lãnh đạo truyền cảm hứng',
        'Kỹ năng giao tiếp và thuyết trình xuất sắc',
        'Quan tâm sâu sắc đến sự phát triển của người khác',
        'Có tầm nhìn chiến lược và khả năng lập kế hoạch dài hạn',
        'Giỏi trong việc xây dựng và duy trì các mối quan hệ',
        'Khả năng thấu hiểu và đáp ứng nhu cầu của người khác'
    ],
    ARRAY[
        'Có thể quá lý tưởng hóa và đặt kỳ vọng cao vào bản thân và người khác',
        'Có thể quá quan tâm đến ý kiến và đánh giá của người khác',
        'Có thể gặp khó khăn trong việc đưa ra quyết định khó khăn khi nó ảnh hưởng đến mối quan hệ',
        'Có thể thiếu tập trung vào chi tiết và thực thi',
        'Có thể dễ dàng bị tổn thương trước những lời chỉ trích'
    ],
    ARRAY[
        'Luật sư', 'Công chức nhà nước', 'Công việc xã hội',
        'Giảng dạy', 'Viết văn', 'Quản lý', 'Kèm cặp',
        'Thiết kế', 'Nghệ nhân', 'Nhạc sĩ hoặc hoạt động giải trí'
    ],
    ARRAY[
        'Học cách trở nên độc lập và quyết đoán hơn, đặc biệt khi xử lý xung đột và phê bình',
        'Trở nên có phương pháp hơn trong công việc',
        'Học cách quản lý thời gian tốt hơn và đưa ra nhiều hành động hiệu quả hơn',
        'Trở nên thực tế hơn và ít lý tưởng hóa hơn trong việc đặt mục tiêu'
    ],
    ARRAY[
        'Cơ hội thể hiện kỹ năng lãnh đạo và phát triển người khác',
        'Môi trường làm việc có giá trị và mục đích rõ ràng',
        'Được công nhận và đánh giá cao cho những đóng góp của họ',
        'Có không gian để xây dựng và duy trì các mối quan hệ ý nghĩa'
    ],
    ARRAY['Nhà huấn luyện', 'Giảng viên đào tạo', 'Nhà tư vấn', 'Nhà lãnh đạo cộng đồng'],
    'Ấm áp, thuyết phục, tập trung vào phát triển con người. Giỏi trong việc tạo động lực và khích lệ người khác.',
    'Kiểu lãnh đạo nhân văn, tập trung vào việc phát triển tiềm năng của từng thành viên và xây dựng một tầm nhìn chung có ý nghĩa.'
),

-- ENTJ - Nhà lãnh đạo
(
    'ENTJ',
    'Nhà lãnh đạo',
    'ENTJ là những người lô-gíc, quyết đoán, tràn đầy sinh lực và có phong cách kinh doanh. Họ thích nhận lãnh trách nhiệm, tìm kiếm sự hứng phấn thông qua việc tham gia vào các hoạt động hoạch định và quán xuyến công việc.',
    ARRAY[
        'Tư duy chiến lược và tầm nhìn dài hạn',
        'Khả năng lãnh đạo và ra quyết định xuất sắc',
        'Tập trung vào kết quả và hiệu suất',
        'Khả năng tổ chức và quản lý nguồn lực hiệu quả',
        'Tư duy logic và phân tích sâu sắc',
        'Khả năng thuyết phục và truyền cảm hứng cho người khác'
    ],
    ARRAY[
        'Có thể thiếu nhạy cảm với cảm xúc và nhu cầu cá nhân của người khác',
        'Có thể tỏ ra quá thẳng thắn hoặc cứng nhắc trong giao tiếp',
        'Có thể thiếu kiên nhẫn với những người làm việc chậm hoặc không hiệu quả',
        'Có thể gặp khó khăn trong việc chấp nhận các quan điểm khác biệt',
        'Có thể đặt kỳ vọng quá cao vào bản thân và người khác'
    ],
    ARRAY[
        'Các vị trí lãnh đạo', 'Tư vấn', 'Luật sư', 'Kinh doanh',
        'Quản lý cấp cao', 'Kỹ thuật', 'Khoa học',
        'Các vị trí đòi hỏi tư duy chiến lược và khả năng lãnh đạo'
    ],
    ARRAY[
        'Phát triển kỹ năng lắng nghe và thấu hiểu cảm xúc của người khác',
        'Học cách kiên nhẫn hơn với những người có nhịp độ làm việc khác biệt',
        'Cân bằng giữa đạt được mục tiêu và quan tâm đến con người',
        'Học cách chấp nhận và đánh giá cao các quan điểm khác biệt'
    ],
    ARRAY[
        'Cơ hội thể hiện kỹ năng lãnh đạo và ra quyết định',
        'Có thách thức và mục tiêu lớn để phấn đấu',
        'Được công nhận cho năng lực và thành tích',
        'Môi trường làm việc hiệu quả, có cấu trúc rõ ràng'
    ],
    ARRAY['Giám đốc điều hành', 'Tổng giám đốc', 'Nhà chiến lược doanh nghiệp', 'Nhà tư vấn cấp cao'],
    'Quyết đoán, trực tiếp, tập trung vào mục tiêu và kết quả. Thích tranh luận dựa trên logic và dữ liệu.',
    'Kiểu lãnh đạo mạnh mẽ, tập trung vào chiến lược và kết quả. Đặt tiêu chuẩn cao và thúc đẩy nhân viên đạt được mục tiêu đầy thách thức.'
);

-- ============================================
-- End of MBTI Types Seed Data
-- ============================================