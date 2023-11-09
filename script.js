
// this will be the function that let us create the board that we will use to display our game
function gameboard(){
    //Define variables that stores the measures of our gameboard
    const rows = 3;
    const columns = 3;
    let board = [];

    //store inside of board 9 cells that has the same methods as cell
    for (let i = 0; i < rows; i++){
        board[i] = [];
        for (let j = 0; j < columns; j++){
            board[i].push(cell());
        }
    }

    //This enable us to get the board array for later use
    const getBoard = () => board;

    //with this method we find the chosen cell and the add the sign into it
    const insertSign = function(row, column, player){
        board[row][column].addSign(player);
    }

    //this lets us assign a value to a cell or get the value of that cell
    function cell(){
        let value = 0;

        const addSign = (player) => {
            value = player;
        }

        const getValue = () => value;

        return{
            addSign,
            getValue
        };
    }

    //thanks to this function we can get the board with the cells updated
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    }

    //we return the desidered methods for lather use
    return{
        getBoard,
        insertSign,
        printBoard
    };
};

function gameController(playerOnename = "Player One", playerTwoName = "Player Two"){
    const board = gameboard();

    const players = [
        {
            name: playerOnename,
            sign: 1
        },
        {
            name: playerTwoName,
            sign: 2
        }
    ]

    let activePlayer = players[0];

    const changePlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}\'s turn.`);
    }

    const winConditions = [
        //row combinations
        [[0][0],[0][1],[0][2]],
        [[1][0],[1][1],[1][2]],
        [[2][0],[2][1],[2][2]],
        //column combinations
        [[0][0],[1][0],[2][0]],
        [[0][1],[1][1],[2][1]],
        [[0][2],[1][2],[2][2]],
        //diagonal condtions
        [[0][0],[1][1],[2][2]],
        [[0][2],[1][1],[2][0]]
    ]

    const checkWin = () => {
        
    }

    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name}\'s puts sing in row n° ${row} and column n°${column}`);

        board.insertSign(row, column, getActivePlayer().sign);

        changePlayerTurn();
        printRound();
    }   

    printRound();

    return{
        playRound,
        getActivePlayer
    }

}

const game = gameController();