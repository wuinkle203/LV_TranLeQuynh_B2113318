import sys
import joblib

sys.stdout.reconfigure(encoding="utf-8")  # Ép Python in UTF-8

print("✅ Python script started", flush=True)

if len(sys.argv) < 2:
    print("❌ Không nhận được dữ liệu từ Node.js", flush=True)
    sys.exit(1)

comment = sys.argv[1]
print(f"📌 Nhận comment: {comment}", flush=True)

# Load model
model_path = "D:/Computer Science/HK2-Nam4/LuanVanTotNghiep/Karaoke/ml_model/models/sentiment_model.pkl"
try:
    model = joblib.load(model_path)
except Exception as e:
    print(f"❌ Lỗi khi tải model: {str(e)}", flush=True)
    sys.exit(1)

# Dự đoán
try:
    prediction = model.predict([comment])[0]
    print(f"📌 Kết quả dự đoán: {prediction}", flush=True)
    print(prediction, flush=True)
except Exception as e:
    print(f"❌ Lỗi khi dự đoán: {str(e)}", flush=True)
    sys.exit(1)
