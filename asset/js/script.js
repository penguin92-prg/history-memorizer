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

      // カードセットの選択ボタン
      let cardSetBtn = document.createElement("button");
      cardSetBtn.setAttribute("id", "cardSetBtn" + String(i+1));
      cardSetBtn.innerHTML = data[0][0];

      cardSetBtn.addEventListener("click", function(){
        document.getElementById("home").classList.remove("active");
        document.getElementById("deck").classList.add("active");
        document.getElementById(this.getAttribute("id").replace("Btn", "")).classList.add("active");
      });

      document.getElementById("container").appendChild(cardSetBtn);

      let cardSet = document.createElement("div");
      cardSet.classList.add("cardSet");
      cardSet.setAttribute("id", "cardSet" + String(i+1));

      for(var j=1; j<data.length; j++){
        let card = document.createElement("div");
        card.classList.add("card");
        card.addEventListener("click", function(){
          this.classList.toggle("active");
        })

        let cardTop = document.createElement("p");
        cardTop.classList.add("cardTop");
        cardTop.innerHTML = data[j][0];

        let cardBack = document.createElement("p");
        cardBack.classList.add("cardBack");
        for(var k=0; k<data[j].length-1; k++){
          if(data[j][k+1] == ""){
            card.style.height = String(2.5 * k + 2 * 2 + 2 * 2) + "rem";
            cardTop.style.height = String(2.5 * k + 2 * 2) + "rem";
            cardTop.style.lineHeight = String(2.5 * k + 2 * 2) + "rem";
            cardBack.style.height = String(2.5 * k + 2 * 2) + "rem";
            break;
          }
          
          let content = document.createElement("p");
          content.innerHTML = data[j][k+1];
          cardBack.appendChild(content);
        }

        card.appendChild(cardTop);
        card.appendChild(cardBack);
        cardSet.appendChild(card);
      }
      document.getElementById("deck").appendChild(cardSet);
    });
  }
}

main();