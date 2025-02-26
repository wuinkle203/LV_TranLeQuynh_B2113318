<template>
  <div class="chat-container">
    <div class="chat-box">
      <div v-for="(msg, index) in messages" :key="index" class="chat-message">
        <span :class="msg.type">{{ msg.text }}</span>
      </div>
    </div>
    <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Nhập tin nhắn..." />
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userInput: "",
      messages: []
    };
  },
  methods: {
    async sendMessage() {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.userId;

      if (!this.userInput) return;
      this.messages.push({ text: this.userInput, type: "user" });

      try {
        const response = await axios.post("http://localhost:8080/chat", {
          message: this.userInput,
          metadata: { user_id: userId } // Gửi userId lên chatbot
        });

        response.data.forEach((msg) => {
          this.messages.push({ text: msg.text, type: "bot" });
        });
      } catch (error) {
        console.error("Lỗi kết nối chatbot", error);
      }

      this.userInput = "";
    }
  }
};
</script>

<style>
.chat-container { width: 400px; margin: auto; border: 1px solid #ccc; padding: 10px; }
.chat-box { height: 300px; overflow-y: auto; border-bottom: 1px solid #ccc; }
.chat-message { margin: 5px 0; }
.user { color: blue; }
.bot { color: green; }
input { width: 100%; padding: 5px; }
</style>
