const { PythonShell } = require("python-shell");

function classifyComment(comment, callback) {
  let options = {
    mode: "text",
    pythonPath: "C:/Users/leq48/AppData/Local/Programs/Python/Python38/python.exe",
    scriptPath: "D:/Computer Science/HK2-Nam4/LuanVanTotNghiep/Karaoke/ml_model/",
    args: [comment],
    encoding: "utf8",
    env: { PYTHONIOENCODING: "utf-8" } // Sửa lỗi UnicodeEncodeError
  };

  console.log("📌 Gửi đến Python:", comment);

  let pyshell = new PythonShell("predict.py", options);
  let output = [];

  pyshell.on("message", function (message) {
    console.log("📌 Python trả về:", message);
    output.push(message);
  });

  pyshell.on("stderr", function (stderr) {
    console.error("⚠️ Python STDERR:", stderr);
  });

  pyshell.on("error", function (err) {
    console.error("❌ Lỗi khi chạy Python:", err);
    callback("error");
  });

  pyshell.on("close", function () {
    console.log("✅ Kết thúc quá trình Python");
    if (output.length === 0) {
      console.error("❌ Không nhận được dữ liệu từ Python");
      callback("error");
    } else {
      callback(output[output.length - 1]);
    }
  });
}

module.exports = classifyComment;
