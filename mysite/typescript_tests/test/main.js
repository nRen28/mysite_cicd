function fetchDataPromise(success) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve("✅ 成功しました！");
      } else {
        reject("❌ エラーが発生しました！");
      }
    }, 1000);
  });
}

document.getElementById("successBtn").addEventListener("click", () => {
  fetchDataPromise(true)
    .then((msg) => {
      alert("成功: " + msg);
    })
    .catch((err) => {
      alert("失敗: " + err);
    })
    .finally(() => {
      alert("🎉 処理が完了しました");
    });
});

document.getElementById("failBtn").addEventListener("click", () => {
  fetchDataPromise(false)
    .then((msg) => {
      alert("成功: " + msg);
    })
    .catch((err) => {
      alert("失敗: " + err);
    })
    .finally(() => {
      alert("🎉 処理が完了しました");
    });
});