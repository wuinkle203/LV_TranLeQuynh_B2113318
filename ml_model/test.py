import joblib
test_comments = [
    "Phòng karaoke rất bẩn, không muốn quay lại",  # Negative
    "Nhạc rất hay, nhân viên phục vụ tốt",          # Positive
    "Âm thanh chán, quá tệ",                        # Negative
    "Dịch vụ tệ, không chuyên nghiệp chút nào",     # Negative
    "Không gian đẹp, chất lượng âm thanh tốt"       # Positive
]

# Load mô hình đã lưu
model = joblib.load("D:/Computer Science/HK2-Nam4/LuanVanTotNghiep/Karaoke/ml_model/models/sentiment_model.pkl")

# Dự đoán
predictions = model.predict(test_comments)

# Hiển thị kết quả
for comment, pred in zip(test_comments, predictions):
    print(f"📝 Bình luận: {comment} -> 🔍 Kết quả: {pred}")
