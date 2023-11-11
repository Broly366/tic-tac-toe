
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

//this will be the function that will controll the game flow
function gameController(playerOneName = "Player One", playerTwoName = "Player Two"){
    //we call the gameboard func to use the methods created in it
    const board = gameboard();

    const players = [
        {
            name: playerOneName,
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
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const winConditions = [
        //row combinations
        [[0, 0],[0, 1],[0, 2]],
        [[1, 0],[1, 1],[1, 2]],
        [[2, 0],[2, 1],[2, 2]],
        //column combinations
        [[0, 0],[1, 0],[2, 0]],
        [[0, 1],[1, 1],[2, 1]],
        [[0, 2],[1, 2],[2, 2]],
        //diagonal condtions
        [[0, 0],[1, 1],[2, 2]],
        [[0, 2],[1, 1],[2, 0]]
    ];

    const checkWin = () => {
        for (const condition of winConditions){
            const [a, b, c] = condition;

            const cellValues = [
                board.getBoard()[a[0]][a[1]].getValue(),
                board.getBoard()[b[0]][b[1]].getValue(),
                board.getBoard()[c[0]][c[1]].getValue()
            ];

            if (cellValues.every(value => value !== 0 && value === cellValues[0])){
                return true;
            }
        };

        return false;
    }

    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name}\'s puts sing in row n° ${row} and column n°${column}`);

        board.insertSign(row, column, getActivePlayer().sign);

        if(checkWin()){
            console.log(`${getActivePlayer().name} wins!`);
            return;
        } else {
            changePlayerTurn();
            printRound();
        }

    }   

    printRound();

    return{
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };

}
function screenController(){
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    function createCellButton(row, column){
        const cellButton =document.createElement('button');
        cellButton.classList.add('cell');
        cellButton.dataset.row = row;
        cellButton.dataset.column = column;
        return cellButton;
    }

    const updateScreen = () => {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn.`

        boardDiv.textContent = "";

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = createCellButton(rowIndex, columnIndex);
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton)
            })
        })
    }

    function clickHandlerBoard(e){
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (selectedRow !== undefined && selectedColumn !== undefined){
            const row = parseInt(selectedRow);
            const column = parseInt(selectedColumn);
            if (!isNaN(row) && !isNaN(column) && game.getBoard()[row][column].getValue() === 0) {
                game.playRound(row, column);
                updateScreen();
            }

        } ;

    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();

}

screenController()  