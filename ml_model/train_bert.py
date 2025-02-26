import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from transformers import BertTokenizer, BertForSequenceClassification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# 📝 1. Load dữ liệu
df = pd.read_csv("D:/Computer Science/HK2-Nam4/LuanVanTotNghiep/Karaoke/ml_model/data/reviews_clean.csv")

# 🏷️ 2. Chuyển nhãn thành số (positive -> 1, negative -> 0)
df['label'] = df['label'].map({'positive': 1, 'negative': 0})

# 🔀 3. Chia dữ liệu train / test
X_train, X_test, y_train, y_test = train_test_split(df['comment'], df['label'], test_size=0.2, random_state=42)

# 🏷️ 4. Load tokenizer từ BERT
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# 📌 5. Định nghĩa Dataset
class SentimentDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        encoding = self.tokenizer(
            self.texts[idx],
            truncation=True,
            padding='max_length',
            max_length=self.max_len,
            return_tensors="pt"
        )
        return {
            'input_ids': encoding['input_ids'].squeeze(0),
            'attention_mask': encoding['attention_mask'].squeeze(0),
            'labels': torch.tensor(self.labels[idx], dtype=torch.long)
        }

# 🏋️ 6. Tạo DataLoader
train_dataset = SentimentDataset(X_train.tolist(), y_train.tolist(), tokenizer)
test_dataset = SentimentDataset(X_test.tolist(), y_test.tolist(), tokenizer)

train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False)

# 📌 7. Load mô hình BERT
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)
model.to(device)

# 🎯 8. Định nghĩa loss function và optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=2e-5)

# 🚀 9. Huấn luyện mô hình
epochs = 3
for epoch in range(epochs):
    model.train()
    total_loss = 0
    for batch in train_loader:
        input_ids, attention_mask, labels = batch['input_ids'].to(device), batch['attention_mask'].to(device), batch['labels'].to(device)

        optimizer.zero_grad()
        outputs = model(input_ids, attention_mask=attention_mask)
        loss = criterion(outputs.logits, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    avg_loss = total_loss / len(train_loader)
    print(f"Epoch {epoch + 1}, Loss: {avg_loss:.4f}")

# 📌 10. Đánh giá mô hình
model.eval()
predictions, true_labels = [], []
with torch.no_grad():
    for batch in test_loader:
        input_ids, attention_mask, labels = batch['input_ids'].to(device), batch['attention_mask'].to(device), batch['labels'].to(device)
        outputs = model(input_ids, attention_mask=attention_mask)
        preds = torch.argmax(outputs.logits, dim=1)
        predictions.extend(preds.cpu().numpy())
        true_labels.extend(labels.cpu().numpy())

accuracy = accuracy_score(true_labels, predictions)
print(f"🎯 Độ chính xác trên tập kiểm tra: {accuracy:.2f}")

# ✅ 11. Lưu mô hình đã huấn luyện
torch.save(model.state_dict(), "D:/Computer Science/HK2-Nam4/LuanVanTotNghiep/Karaoke/ml_model/models/bert_sentiment.pth")
joblib.dump(tokenizer, "D:/Computer Science/HK2-Nam4/LuanVanTotNghiep/Karaoke/ml_model/models/bert_tokenizer.pkl")
print("✅ Đã lưu mô hình và tokenizer!")
