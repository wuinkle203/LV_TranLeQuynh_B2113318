import pandas as pd
import re
import string

# Đọc dữ liệu
df = pd.read_csv("D:/Computer Science/HK2-Nam4/LuanVanTotNghiep/Karaoke/ml_model/data/reviews_5000.csv")

# Hàm làm sạch văn bản
def clean_text(text):
    text = str(text).lower()  # Chuyển thành chữ thường
    text = re.sub(r'\d+', '', text)  # Xóa số
    text = text.translate(str.maketrans('', '', string.punctuation))  # Xóa dấu câu
    text = text.strip()
    return text

# Áp dụng làm sạch dữ liệu
df['comment'] = df['comment'].apply(clean_text)

# Loại bỏ các dòng bị trùng
df = df.drop_duplicates(subset=['comment'], keep='first')

# Lưu dữ liệu đã làm sạch và không trùng lặp
df.to_csv("D:/Computer Science/HK2-Nam4/LuanVanTotNghiep/Karaoke/ml_model/data/reviews_clean.csv", index=False)

print(f"✅ Đã làm sạch dữ liệu và loại bỏ trùng lặp! Tổng số dòng còn lại: {len(df)}")
