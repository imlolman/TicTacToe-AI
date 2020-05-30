HEIGHT = 3
WIDTH = 3
X = 'X'
O = 'O'
AI = null
var tictactoe;
heading = "Play as O"

function runGame(){
    document.querySelector('.withoutGame').style.display = "block";
    document.querySelector('.withGame').style.display = "none";
    document.getElementById("playAgain").style.display = "none"
    resetGame()
}

function AIplaysAs(player){
    document.querySelector('.withoutGame').style.display = "none";
    document.querySelector('.withGame').style.display = "flex";
    AI = player
    tictactoe.checkAIMove()
}

function resetGame(){
    tictactoe = new TicTacToe;
}

function makeMove(cell){
    tictactoe.move(cell)
    tictactoe.checkAIMove()
}


class TicTacToe{
    constructor(){
        this.board = [
            [ null, null, null ],
            [ null, null, null ],
            [ null, null, null ]
        ]
        heading = "Play as X"
        this.redraw()
    }
    
    move(cell){
        if(!terminal(this.board)){
            if(this.checkFree(cell)){
                this.board = result(this.board, cell)
                heading = "Play as "+player(this.board)    
            }
        }
        if(terminal(this.board)){
            this.markWinner()
        }
        this.redraw()
    }
    
    async checkAIMove(){
        if(!terminal(this.board)){
            if(AI == player(this.board)){
                heading = "Computer Thinking.."
                this.redraw()
                await this.aiMove()
            }
        }
    }
    
    markWinner(){
        if(winner(this.board)){
            heading = "Game Over: "+winner(this.board)+" wins."
        }else{
            heading = "Game Over: Tie."
        }
        document.getElementById("playAgain").style.display = "block"
    }

    checkFree(cell){
        return this.board[cell[0]][cell[1]] == null
    }

    redraw(){
        for(var i of range(HEIGHT)){
            for(var j of range(WIDTH)){
                document.getElementById("x"+i.toString()+"x"+j.toString()).innerHTML = this.board[i][j]
            }
        }
        document.getElementById("headBox").innerHTML = heading
    }

    aiMove(){
        return new Promise(resolve => {
            setTimeout(() => {
                this.move(minimax(this.board))
                resolve('resolved');
            }, 100);
          });
    }
}

function player(board){
    /*
    Returns player who has the next turn on a board.
    */
    // Unpacking 2D Board into 1D
    var moves = board.reduce(function(prev, curr) {
        return prev.concat(curr);
    });
    // As X always goes first, if X'es are equal to O'es, its X move else its O's
    return (moves.count(X) == moves.count(O))? X : O
}

function result(board, action){
    /*
    Returns the board that results from making move (i, j) on the board.
    */
    newBoard = [[...board[0]],[...board[1]],[...board[2]]]
    newBoard[action[0]][action[1]] = player(board)
    return newBoard
}

function terminal(board){
    /*
    Returns True if game is over, False otherwise.
    */
    var moves = board.reduce(function(prev, curr) {
        return prev.concat(curr);
    });
    
    if(moves.indexOf(null) == -1 || winner(board) != null){
        return true
    }
    return false
}

function actions(board){
    /*
    Returns set of all possible actions (i, j) available on the board.
    */
    var actions = []
    for(i of range(HEIGHT)){
        for(j of range(WIDTH)){
            if(board[i][j] == null)
                actions.push([i, j])
        }
    }
    return actions
};

function utility(board){
    /*
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    */
    win = winner(board)
    if(win == X)
        return 1
    if(win == O)
        return -1
    return 0
}

function winner(board) {
    const lines = [
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]]
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        a &&
        a === b &&
        a === c
      ) {
        return a;
      }
    }
    return null;
}


function minimax(board, called_first_time=true){
    /*
    Returns the optimal action for the current player on the board if called first time.
    else actions_score
    */
    var available_actions = actions(board)
    var actions_score = []

    for(var action of available_actions){
        var resultBoard = result(board, action)
        if(terminal(resultBoard)){

            actions_score.push(utility(resultBoard))
            continue
        }
        var n = minimax(resultBoard, false)
        actions_score.push(n)
        
        // Breaking if Max/Min score is already found (no need to search more)
        if(player(board) == X && n == 1){
            break
        }
        if(player(board) == O && n == -1){
            break
        }
    }
    
    // Getting Max/Min Score according to player
    // console.log(actions_score)
    var score = 0
    if(player(board) == X){
        score = Math.max(...actions_score)
    }else{
        score = Math.min(...actions_score)
    }
    

    // Returning action if called for the first time
    if(called_first_time)
        return available_actions[actions_score.indexOf(score)]
    else
        return score
}

function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

Array.prototype.count = function(elem){
    count = 0
    for(var item of this){
        if(elem == item){
            count += 1
        }
    }
    return count
};

// // Removing Right Click to call a function
function runOnLoad() {
    if(window.innerWidth < 500){
        var mvp = document.getElementById('myViewport');
        mvp.setAttribute('content','width=500 user-scalable=0');
    }

    document.addEventListener('contextmenu', event => event.preventDefault());

    for(var i of range(HEIGHT)){
        for(var j of range(WIDTH)){
            document.getElementById("x"+i.toString()+"x"+j.toString()).addEventListener("click", function(e){
                cell = [parseInt(this.id.split(`x`)[1]),parseInt(this.id.split(`x`)[2])]
                makeMove(cell)
            });
        }
    }
    runGame()
}