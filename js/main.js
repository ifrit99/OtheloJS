import ReverseOrCheck from "./ReverseOrCheck.js";

// .squareセレクタの要素を取得
let squareList = document.querySelectorAll(".square");

// squareCollectionを一次元配列へ変換
let boardArray = Array.from(squareList);

// 一次元配列から要素を８つずつ分割して二次元配列に変換
let boardArray2dim = divideArrIntoPieces(boardArray, 8);

let myStone = "blackStone"; // 自分の石(初期値：黒石)
let rivalStone = "whiteStone"; // 敵の石(初期値：白石)

let scoreArray = []; // スコア用配列

// 石を置く関数をクリックイベント発火で全マス目に配置
const len = boardArray2dim.length;
const len2 = boardArray2dim[0].length;
for (let j = 0; j < len; j++) {
  for (let i = 0; i < len2; i++) {
    boardArray2dim[j][i].addEventListener("click", putStone);
  }
}

// パスボタン
const passButton = document.getElementById("pass");
passButton.addEventListener("click", function () {
  turnChange(myStone);
});

// 白と黒のターン切替
function turnChange(stoneColor) {
  let turnPlate = document.getElementById("turnPlate");
  if (stoneColor === "blackStone") {
    myStone = "whiteStone";
    rivalStone = "blackStone";
    turnPlate.innerHTML = "白の番";
    turnPlate.style.backgroundColor = "black";
    turnPlate.style.color = "white";
  } else {
    myStone = "blackStone";
    rivalStone = "whiteStone";
    turnPlate.innerHTML = "黒の番";
    turnPlate.style.backgroundColor = "white";
    turnPlate.style.color = "black";
  }
}

// 石を置く関数
function putStone() {
  if (
    this.classList.contains(myStone) === false &&
    this.classList.contains(rivalStone) === false
  ) {
    // 石を置く座標のインデックスを探索
    // rowIndex=石を置いた行、elementIndex=石を置いた列
    boardArray2dim.forEach((rowArray, rowIndex) => {
      rowArray.forEach((element, elementIndex) => {
        if (element === this) {
          // 反転可否チェッククラスのインスタンス生成
          let rightCheck = new Check(elementIndex, rowIndex, 1, 0);
          let leftCheck = new Check(elementIndex, rowIndex, -1, 0);
          let upCheck = new Check(elementIndex, rowIndex, 0, -1);
          let downCheck = new Check(elementIndex, rowIndex, 0, 1);
          let rightUpCheck = new Check(elementIndex, rowIndex, 1, -1);
          let leftUpCheck = new Check(elementIndex, rowIndex, -1, -1);
          let rightDownCheck = new Check(elementIndex, rowIndex, 1, 1);
          let leftDownCheck = new Check(elementIndex, rowIndex, -1, 1);

          // 反転可否チェックで返ってくる連想配列を受け取る
          let rightCheckArray = rightCheck.arrayMove();
          let leftCheckArray = leftCheck.arrayMove();
          let upCheckArray = upCheck.arrayMove();
          let downCheckArray = downCheck.arrayMove();
          let rightUpCheckArray = rightUpCheck.arrayMove();
          let leftUpCheckArray = leftUpCheck.arrayMove();
          let rightDownCheckArray = rightDownCheck.arrayMove();
          let leftDownCheckArray = leftDownCheck.arrayMove();

          // 連想配列内の反転可否フラグを格納
          let rightCheckFlag = rightCheckArray.checkFlag;
          let leftCheckFlag = leftCheckArray.checkFlag;
          let upCheckFlag = upCheckArray.checkFlag;
          let downCheckFlag = downCheckArray.checkFlag;
          let rightUpCheckFlag = rightUpCheckArray.checkFlag;
          let leftUpCheckFlag = leftUpCheckArray.checkFlag;
          let rightDownCheckFlag = rightDownCheckArray.checkFlag;
          let leftDownCheckFlag = leftDownCheckArray.checkFlag;

          if (
            rightCheckFlag ||
            leftCheckFlag ||
            upCheckFlag ||
            downCheckFlag ||
            rightUpCheckFlag ||
            leftUpCheckFlag ||
            rightDownCheckFlag ||
            leftDownCheckFlag
          ) {
            // 8方向どれか1つの反転可否フラグがtrueなら石を置く
            this.classList.add(myStone);

            // チェックフラグがtrueになっている方向の反転処理を実行する
            if (rightCheckFlag) {
              // 反転クラスインスタンス生成 引数：(石を置いた行, 石を置いた列, xオフセット値, yオフセット値)
              let rightReverse = new Reverse(elementIndex, rowIndex, 1, 0);
              rightReverse.arrayMove();
            }
            if (leftCheckFlag) {
              let leftReverse = new Reverse(elementIndex, rowIndex, -1, 0);
              leftReverse.arrayMove();
            }
            if (upCheckFlag) {
              let upReverse = new Reverse(elementIndex, rowIndex, 0, -1);
              upReverse.arrayMove();
            }
            if (downCheckFlag) {
              let downReverse = new Reverse(elementIndex, rowIndex, 0, 1);
              downReverse.arrayMove();
            }
            if (rightUpCheckFlag) {
              let rightUpReverse = new Reverse(elementIndex, rowIndex, 1, -1);
              rightUpReverse.arrayMove();
            }
            if (leftUpCheckFlag) {
              let leftUpReverse = new Reverse(elementIndex, rowIndex, -1, -1);
              leftUpReverse.arrayMove();
            }
            if (rightDownCheckFlag) {
              let rightDownReverse = new Reverse(elementIndex, rowIndex, 1, 1);
              rightDownReverse.arrayMove();
            }
            if (leftDownCheckFlag) {
              let leftDownReverse = new Reverse(elementIndex, rowIndex, -1, 1);
              leftDownReverse.arrayMove();
            }

            // 反転処理終了後ターンチェンジ
            turnChange(myStone);
          } else {
            alert("そこに石は置けません。");
          }
        }
      });
    });
  } else {
    alert("そこには既に石が置いてあります。");
  }
  setTimeout(scoreJudge, 500);
}

// スコアボード更新・勝敗判定
function scoreJudge() {
  scoreArray = toCountDict(boardArray2dim);
  if (scoreArray.squareblackStone + scoreArray.squarewhiteStone === 64) {
    alert("ゲームセット！");
    if (scoreArray.squareblackStone > scoreArray.squarewhiteStone) {
      alert(
        "黒の勝ちです。 " +
          "黒：" +
          scoreArray.squareblackStone +
          " 白：" +
          scoreArray.squarewhiteStone
      );
    } else if (scoreArray.squareblackStone < scoreArray.squarewhiteStone) {
      alert(
        "白の勝ちです。 " +
          "黒：" +
          scoreArray.squareblackStone +
          " 白：" +
          scoreArray.squarewhiteStone
      );
    } else {
      alert(
        "引き分けです。 " +
          "黒：" +
          scoreArray.squareblackStone +
          " 白：" +
          scoreArray.squarewhiteStone
      );
    }
  }
}

// 配列内の要素をカウントし連想配列を作成して返す関数
function toCountDict(array) {
  let countArray = []; // クラス名格納用配列
  let i = 0;
  const len = array.length;
  const len2 = array[0].length;

  // 引数の配列のクラス名を配列へ格納する
  for (let j = 0; j < len; j++) {
    for (let k = 0, len2 = array[j].length; k < len2; k++) {
      countArray[i] = boardArray2dim[j][k].className.replace(/\s+/g, "");
      i++;
    }
  }

  let dict = {};
  // クラス名の配列内の要素をカウントし連想配列を作成
  for (let key of countArray) {
    dict[key] = countArray.filter(function (x) {
      return x == key;
    }).length;
  }
  return dict;
}

// 反転可否チェッククラス
class Check extends ReverseOrCheck {
  constructor(xIndex, yIndex, offsetValueX, offsetValueY) {
    super(xIndex, yIndex, offsetValueX, offsetValueY);
  }

  arrayMove() {
    return super.arrayMove();
  }

  acutualProcessing(x, y, resultArray) {
    if (boardArray2dim[y][x].classList.contains(rivalStone) === true) {
      // オフセットで移動した先が敵の色の石だったらx座標、y座標を更新する
      resultArray.reverseX = x;
      resultArray.reverseY = y;
      return resultArray;
    } else if (boardArray2dim[y][x].classList.contains(myStone) === true) {
      // オフセットで移動した先が自分の色の石だったら反転可否の判定へ
      if (resultArray.reverseX > 0 || resultArray.reverseY > 0) {
        // 敵の石が見つかっていれば反転可能なのでチェックフラグをtrueにする
        resultArray.checkFlag = true;
      }
      return resultArray;
    } else {
      // オフセットで移動した先に石がなかったら{0, 0, false}を返す
      return { reverseX: 0, reverseY: 0, checkFlag: false };
    }
  }
}

// 反転処理クラス
class Reverse extends ReverseOrCheck {
  constructor(xIndex, yIndex, offsetValueX, offsetValueY) {
    super(xIndex, yIndex, offsetValueX, offsetValueY);
  }

  acutualProcessing(x, y, resultArray) {
    // reverseX と reverseY は、スーパークラスで継続させるために初期化
    resultArray = { reverseX: -1, reverseY: -1, checkFlag: true };

    // 反転処理
    if (boardArray2dim[y][x].classList.contains(rivalStone) === true) {
      boardArray2dim[y][x].classList.remove(rivalStone);
      boardArray2dim[y][x].classList.add(myStone);
      resultArray.checkFlag = false;
    }

    return resultArray;
    // if (boardArray2dim[y][x].classList.contains(rivalStone) === true) {
    //   // オフセットで移動した先が敵の色の石だったらx座標を格納
    //   resultArray.reverseX = x;
    //   resultArray.reverseY = y;
    //   return resultArray; //{ reverseX: reverseX, reverseY: reverseY, checkFlag: checkFlag };
    // } else if (boardArray2dim[y][x].classList.contains(myStone) === true) {
    //   // オフセットで移動した先が自分の色の石だったら反転処理へ

    //   // 反転対象を発見していれば反転ループへ入る
    //   if (resultArray.reverseX > 0 || resultArray.reverseY > 0) {
    //     // 石を置いた座標に戻ってくるまで反転し続ける
    //     while (
    //       resultArray.reverseX !== this.xIndex ||
    //       resultArray.reverseY !== this.yIndex
    //     ) {
    //       boardArray2dim[resultArray.reverseY][
    //         resultArray.reverseX
    //       ].classList.remove(rivalStone);
    //       boardArray2dim[resultArray.reverseY][
    //         resultArray.reverseX
    //       ].classList.add(myStone);
    //       resultArray.reverseX = resultArray.reverseX - this.offsetValueX;
    //       resultArray.reverseY = resultArray.reverseY - this.offsetValueY;
    //     }
    //   }
    //   return { reverseX: 0, reverseY: 0, checkFlag: false }; // 反転したらループ終了させるため{0,0,false}を返す
    // } else {
    //   // オフセットで移動した先に石がなかったら{0, 0, false}を返す
    //   return { reverseX: 0, reverseY: 0, checkFlag: false };
    // }
  }
}

/**
 * 配列 arr を n 個ずつに分けて返す
 **/
function divideArrIntoPieces(arr, n) {
  var arrList = [];
  while (0 < arr.length) {
    arrList.push(arr.splice(0, n));
  }
  return arrList;
}
