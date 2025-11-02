// ファイルの存在確認
const checkFileExistence = async function(url) {

  const response = await fetch(url);

  if (response.status === 200) {
    return 0;
  } else {
    return 1;
  }
};

// ==================================================
// ==================================================
// ==================================================

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

// ==================================================
// ==================================================
// ==================================================

// メイン関数
async function main(){

  // CSVファイルを「1.csv」から順に読み込んでいく
  for(var i=0; i>=0; i++){
    if(await checkFileExistence("./asset/csv/" + String(i+1) + ".csv")){
      break;
    }

    // ファイルが存在する場合
    await fetchCSV("./asset/csv/" + String(i+1) + ".csv").then(data => {

      // ==================================================

      // カードセットの選択ボタンを作成
      let cardSetBtn = document.createElement("button");
      cardSetBtn.setAttribute("id", "cardSetBtn" + String(i+1));
      cardSetBtn.innerHTML = data[0][0];

      // ==================================================

      cardSetBtn.addEventListener("click", function(){
        document.getElementById("home").classList.remove("active");
        document.getElementById("deck").classList.add("active");
        document.getElementsByTagName("nav")[0].classList.add("active");
        document.getElementById(this.getAttribute("id").replace("Btn", "")).classList.add("active");
      });

      document.getElementById("container").appendChild(cardSetBtn);

      // ==================================================
      // ==================================================
      // ==================================================

      // カードを作成
      let cardSet = document.createElement("div");
      cardSet.classList.add("cardSet");
      cardSet.setAttribute("id", "cardSet" + String(i+1));

      for(var j=1; j<data.length; j++){

        // カード本体を作成
        let card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("id", "cardSet" + String(i+1) + "-card" + j);
        card.addEventListener("click", function(){
          this.classList.toggle("active");
        });

        // カードの表面を作成
        let cardTop = document.createElement("div");
        cardTop.classList.add("cardTop");
        let question = document.createElement("p");
        question.innerText = data[j][0].replaceAll("　", "\n");
        cardTop.appendChild(question);

        // カードの裏面を作成
        let cardBack = document.createElement("div");
        cardBack.classList.add("cardBack");
        let answer = document.createElement("p");
        answer.innerText = data[j][1].replaceAll("　", "\n");;
        cardBack.appendChild(answer);
        if(data[j][2] != ""){
          let addition = document.createElement("span");
          addition.innerHTML = data[j][2].replaceAll("　", "\n");;
          cardBack.appendChild(addition);
        }

        card.appendChild(cardTop);
        card.appendChild(cardBack);
        cardSet.appendChild(card);

      }
      document.getElementById("deck").appendChild(cardSet);

      requestAnimationFrame(() => {
        // 一時的に表示して計測（ユーザーには見えない）
        cardSet.style.display = "flex";
        cardSet.style.visibility = "hidden";
        cardSet.style.position = "absolute";

        // そのセット内のカードだけを処理
        adjustHeightsForSet(cardSet);

        // 元に戻す
        cardSet.style.display = "";
        cardSet.style.visibility = "";
        cardSet.style.position = "";
      });
    });
  }
}

function adjustHeightsForSet(cardSet) {
  const cards = cardSet.querySelectorAll(".card");
  cards.forEach(card => {
    const front = card.querySelector('.cardTop');
    const back = card.querySelector('.cardBack');

    // 場合によって front/back が null になり得るのでガード
    if (!front || !back) return;

    card.style.removeProperty("height");
    front.style.removeProperty("height");
    back.style.removeProperty("height");

    void card.offsetHeight;

    const frontHeight = front.scrollHeight;
    const backHeight = back.scrollHeight;
    const h = Math.max(frontHeight, backHeight);

    console.log(h);

    // 親と子に高さを入れる
    card.style.height = h + 'px';
    front.style.height = h + 'px';
    back.style.height = h + 'px';
  });
}



window.addEventListener("load", function(){
  // CSV読込･DOM作成
  main();

  // ボタンにイベントリスナーを登録
  document.getElementById("backBtn").addEventListener("click", function(){
    document.getElementById("home").classList.add("active");
    document.getElementById("deck").classList.remove("active");
    document.getElementsByTagName("nav")[0].classList.remove("active");
    document.querySelectorAll(".cardSet").forEach(function(value){
      value.classList.remove("active");
    });
  });

  // カードをシャッフルする
  document.getElementById("shuffleBtn").addEventListener("click", function(){
    let obj = document.getElementsByClassName("cardSet active")[0]
    let len = obj.childElementCount;
    
    for(var i=0; i<500; i++){
      let a = Math.floor(Math.random() * len); 
      obj.appendChild(obj.children[a]);
    }
  });

  // 元の順番に戻す
  document.getElementById("organizeBtn").addEventListener("click", function(){
    let elements = Array.from(document.getElementsByClassName("cardSet active")[0].querySelectorAll(".card"));
    
    elements.sort((a, b) => {
      const idA = parseInt(a.id.match(/cardSet\d+-card(\d+)/)[1]);
      const idB = parseInt(b.id.match(/cardSet\d+-card(\d+)/)[1]);
      return idA - idB; // 昇順にソート
    });
    let tempContainer = document.createElement("div");

    elements.forEach(element => {
      tempContainer.appendChild(element);
    });

    Array.from(document.getElementsByClassName("cardSet active")[0].children).forEach(elem => {
      elem.remove();
    });
    Array.from(tempContainer.children).forEach(value => {
      document.getElementsByClassName("cardSet active")[0].appendChild(value);
    });

    tempContainer.remove();

  });
});
