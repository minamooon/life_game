var SCREEN_SIZE_WIDTH = 1002;
var SCREEN_SIZE_HEIGHT = 602;

//一行のセルの数
var SIDE_CELLS = 501;
//セル幅
var CELL_SIZE = Math.floor(SCREEN_SIZE_WIDTH / SIDE_CELLS);
//一列のセルの数
var COLUMN_CELLS = Math.floor(SCREEN_SIZE_HEIGHT/ CELL_SIZE);
//フレームレート
var FPS = 20;

var canvas;
//おまじない
var context;

window.onload = function() {
//セルの状態配列
  var cellInfos = new Array(SIDE_CELLS * COLUMN_CELLS);//列を一行にしてる=一次元配列として扱っている
//セルの状態更新時に今の状態を覚えておくための一時配列
  var tempCellInfos = new Array(SIDE_CELLS * COLUMN_CELLS);

//セルの状態初期化。乱数を作って入れる。
  for(var index = 0; index < cellInfos.length; index++){
    cellInfos[index] = Math.floor(Math.random() * 2);
  }

//ゲーム画面取得
canvas = document.getElementById('gameScreen');
canvas.width = SCREEN_SIZE_WIDTH;
canvas.height = SCREEN_SIZE_HEIGHT;

//キャンパスの拡縮レートの計算
var scaleRate = Math.min(window.innerWidth / SCREEN_SIZE_WIDTH, window.innerHeight / SCREEN_SIZE_HEIGHT);
canvas.style.width = SCREEN_SIZE_WIDTH * scaleRate + 'px';
canvas.style.height = SCREEN_SIZE_HEIGHT * scaleRate + 'px';

//コンテキストを取得（canvasを描画するのに必要なおまじないです。）
context = canvas.getContext('2d');
//色の設定
context.fillStyle = 'rgb(218,35,40)';

//メインループ実行開始
 draw(cellInfos);
 setTimeout(update, 1000 / FPS, cellInfos, tempCellInfos);
}

//ライフゲームのメインループ
function update(cellInfos, tempCellInfos){
  //sliceで先頭からおしりまで切り出してコピーすると結果的に全部コピーになる。http://www.ajaxtower.jp/js/string_class/index6.html
  tempCellInfos = cellInfos.slice();
  for(var index = 0; index < tempCellInfos.length; index++){
    //今から各細胞の自分のまわりの生死をチェックするので、カウンターを用意
    var liveCellCount = 0;
     //このコードでは前の行、隣の行、前の列、隣の列を二つのループで表現します
    for(var rowPointer = -1; rowPointer < 2; rowPointer++){
      for(var colPointer = -1; colPointer < 2; colPointer++){
        //もし自分ならばカウントしないので飛ばします。
        if(rowPointer == 0 && colPointer == 0){
          //コンティニューでこの回の繰り返しをパスすることができます。
          continue;
        }

        //チェックするセルの番号を算出します
        var cellIndex = index + rowPointer * SIDE_CELLS + colPointer;
        if(cellIndex < 0 || cellIndex >= tempCellInfos.length){
          //上下の領域からはみ出していたらループをパス
          continue;
        }
        if(index < cellIndex && cellIndex % SIDE_CELLS == 0 || index > cellIndex && cellIndex % SIDE_CELLS == SIDE_CELLS-1){
          //左右が自分の隣の列でなくればループをパス
          continue;
        }

        //対象の細胞が生きているならカウントアップする
        if(tempCellInfos[cellIndex] > 0){
          liveCellCount++;
        }

      }
    }

    //ここでルールを判定する
    if(tempCellInfos[index] && (liveCellCount == 2 || liveCellCount == 3)){
      //自分が生きていて、カウンターが2か3なら生存
      cellInfos[index] = 1;
    } else if (!tempCellInfos[index] && liveCellCount == 3){
      //自身が死んでいて、カウンターが3なら誕生
      cellInfos[index] = 1;
    } else {
      //それ意外なら死亡
      cellInfos[index] = 0;
    }
  }


//描画します
  draw(cellInfos);
  //今回はゲームループを再帰的な呼び出しで簡単に表現します
  setTimeout(update, 1000 / FPS, cellInfos, tempCellInfos);
}


//画面描画処理
function draw(cellInfos){
  //画面クリア
  context.clearRect(0, 0, SCREEN_SIZE_WIDTH, SCREEN_SIZE_HEIGHT);
  //細胞の四角を描画
  for(var index = 0; index < cellInfos.length; index++){
  //四角（細胞）の幅の座標を計算 X番目のインデックスを１行内のセルの数で割ったの余りをセルの１辺のサイズでかけ算すると横軸の座標になります。
  var x = (index % SIDE_CELLS) * CELL_SIZE;
  //四角の高さの座標を計算
  var y = Math.floor(index / SIDE_CELLS) * CELL_SIZE;
  if(cellInfos[index] > 0){
    context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  }
  }
}

//
