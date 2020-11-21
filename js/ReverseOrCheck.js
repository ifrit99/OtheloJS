export default class ReverseOrCheck {
  constructor(xIndex, yIndex, offsetValueX, offsetValueY) {
    this.xIndex = xIndex; // x軸方向の座標
    this.yIndex = yIndex; // y軸方向の座標
    this.offsetValueX = offsetValueX; // x軸オフセット値
    this.offsetValueY = offsetValueY; // y軸オフセット値
  }

  // 反転対象探索用の移動処理
  arrayMove() {
    let x = this.xIndex;
    let y = this.yIndex;
    let resultArray = { reverseX: 0, reverseY: 0, checkFlag: false };
    // 盤上の間繰り返す
    while (0 <= x < 8 && 0 <= y < 8) {
      // x, y座標にオフセット値を適用
      x += this.offsetValueX;
      y += this.offsetValueY;

      // x,yが配列のインデックス範囲から出たらループを抜ける
      if (x < 0 || y < 0 || x > 7 || y > 7) {
        break;
      }

      // 実際の処理を行う抽象クラスの関数を呼び出し、返り値として連想配列を受け取る
      resultArray = this.acutualProcessing(x, y, resultArray);

      // checkFlag(反転可否フラグ)がtrueまたは反転対象の(x,y)座標が(0,0)ならループを抜ける
      if (
        resultArray.checkFlag ||
        (resultArray.reverseX === 0 && resultArray.reverseY === 0)
      ) {
        break;
      }
    }
    return resultArray;
  }

  acutualProcessing(x, y, reverseX, reverseY) {} // 実際の処理定義用の抽象クラス
}
