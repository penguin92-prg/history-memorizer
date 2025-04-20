// ファイルの存在確認
const checkFileExistence = async function(url) {

  const response = await fetch(url);

  if (response.status === 200) {
    return 0;
  } else {
    return 1;
  }
};

// CSVファイル読込関数
async function fetchCSV(url) {
  try {
      const response = await fetch(url);
      const csvText = await response.text();
      
      // CSVを二次元配列に変換
      const data = csvText
          .trim()
          .split("\n")
          .map(row => row.split(",").map(cell => cell.trim()));

      return data;
  } catch (error) {
      console.error("Error fetching CSV:", error);
      return null;
  }
}

// メイン関数
async function main(){
  for(var i=0; i>=0; i++){
    if(await checkFileExistence("./asset/csv/" + String(i+1) + ".csv")){
      break;
    }

    // 以下ファイルが存在する場合
    await fetchCSV("./asset/csv/" + String(i+1) + ".csv").then(data => {
      console.log(data);

      // カードセットの選択ボタン
      let cardsetBtn = document.createElement("button");
      cardsetBtn.setAttribute("id", "set-" + String(i+1));
      cardsetBtn.innerHTML = data[0][0];

      cardsetBtn.addEventListener("click", function(){
        document.getElementById("description").classList.remove("active");
        document.getElementById("container").classList.remove("active");
        document.getElementById("deck").classList.add("active");
      });

      document.getElementById("container").appendChild(cardsetBtn);
    });
  }
}

main();