var origboard;
const huPlayer='0';
const aiPlayer='x';
var flag=false;
const winCombos=[
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[6,4,2],
]
const cells=document.querySelectorAll('.cell');
function start(){
	flag=true;
	startGame();
}
function start1(){
	flag=false;
	startGame();
}
startGame();
function startGame(){
	document.querySelector('.endgame').style.display="none";
	origboard=Array.from(Array(9).keys());
	for (var i=0;i<cells.length;i++){
		cells[i].innerText="";
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click',turnClick)
	}
}
function turnClick(e){
	if(typeof origboard[e.target.id]=='number'){
	turn(e.target.id,huPlayer)
	if(!checkTie()) turn(bestSpot(),aiPlayer);
	}
}
function turn(id,player){
	origboard[id]=player;
	document.getElementById(id).innerText=player;
	let gameWon=checkWin(origboard,player);
	if(gameWon) gameOver(gameWon);
}
function checkWin(board,player){
	let plays=board.reduce((a,e,i)=>
		(e==player)? a.concat(i): a, []);
		let gameWon=null;
		for(let [index,win] of winCombos.entries()){
			if(win.every(elem =>plays.indexOf(elem)> -1)){
				gameWon={index:index,player:player};
				break;
			}
		}
		return gameWon;
}
function gameOver(gameWon){
	for(let index of winCombos[gameWon.index]){
		document.getElementById(index).style.backgroundColor=
		gameWon.player==huPlayer ? "blue" :"red";
	}
	for( var i=0; i<cells.length;i++){
		cells[i].removeEventListener('click',turnClick)
	}
	declareWinner(gameWon.player==huPlayer? "你赢了" :"你输了")
}
function declareWinner(who){
	document.querySelector('.endgame').style.display="block";
	document.querySelector(".endgame .text").innerText=who;
}
function emptySquares(){
	return origboard.filter(s=> typeof s=='number');
}
function bestSpot(){
	if(flag){
		return emptySquares()[0];
	}else{
		return minimax(origboard,aiPlayer).index;
	}
	
}
function checkTie(){
	if(emptySquares().length==0){
		for(var i=0;i<cells.length;i++){
			cells[i].style.backgroundColor='green';
			cells[i].removeEventListener('click',turnClick);
		}
		declareWinner("游戏结束")
		return true;
	}
	return false;
}
function minimax(newBoard,player){
	var avaiLSpots=emptySquares(newBoard);
	if(checkWin(newBoard,player)){
		return {score:-10};
	}else if(checkWin(newBoard,aiPlayer)){
		return {score:20};
	}else if(avaiLSpots.length==0){
		return {score:0}
	}
	var moves=[];
	for(var i=0;i<avaiLSpots.length;i++){
		var move={};
		move.index=newBoard[avaiLSpots[i]];
		newBoard[avaiLSpots[i]]=player;
		if(player==aiPlayer){
			var result=minimax(newBoard,huPlayer);
			move.score=result.score;
		}else{
			var result=minimax(newBoard,aiPlayer);
			move.score=result.score;
		}
		newBoard[avaiLSpots[i]]=move.index;
		moves.push(move);
	}
	var bestMove;
	if(player==aiPlayer){
		var bestScore=-1000;
		for(var i=0;i<moves.length;i++){
			if(moves[i].score>bestScore){
				bestScore=moves[i].score;
				bestMove=i;
			}
		}
	}else{
		var bestScore= 1000;
		for(var i=0;i<moves.length;i++){
			if(moves[i].score<bestScore){
				bestScore=moves[i].score;
				bestMove=i;
			}
		}
	}
	return moves[bestMove];
}