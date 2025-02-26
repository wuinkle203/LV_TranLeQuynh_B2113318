import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression

# Đọc dữ liệu đã làm sạch
df = pd.read_csv("D:/Computer Science/HK2-Nam4/LuanVanTotNghiep/Karaoke/ml_model/data/reviews_clean.csv")

# Chia lại dữ liệu train/test
X_train, X_test, y_train, y_test = train_test_split(df['comment'], df['label'], test_size=0.3, random_state=42)

# Tăng ngram_range để mô hình hiểu cụm từ tốt hơn
model = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1,2))),
    ('classifier', LogisticRegression(max_iter=500))
])

# Train mô hình
model.fit(X_train, y_train)

# Dự đoán trên tập test
y_pred = model.predict(X_test)

# Đánh giá độ chính xác
accuracy = accuracy_score(y_test, y_pred)
print(f"🎯 Độ chính xác của mô hình: {accuracy:.2f}")

# Lưu mô hình
joblib.dump(model, "D:/Computer Science/HK2-Nam4/LuanVanTotNghiep/Karaoke/ml_model/models/sentiment_model.pkl")
print("✅ Đã lưu mô hình vào 'sentiment_model.pkl'!")
