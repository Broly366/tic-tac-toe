
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

    const getCellValue = (row, column) => {
        return board[row][column].getValue();
    }

    //this lets us assign a value to a cell or get the value of that cell
    function cell(){
        let value = '';

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
        printBoard,
        getCellValue
    };
};

//this will be the function that will controll the game flow
function gameController(playerOneName = "Player One", playerTwoName = "Player Two"){
    //we call the gameboard func to use the methods created in it
    let board = gameboard();
    const playerOneDiv = document.querySelector('.player-one');
    const playerTwoDiv = document.querySelector('.player-two')
    //obeject that stores my players
    const players = [
        {
            name: playerOneName,
            sign: 'X'
        },
        {
            name: playerTwoName,
            sign: 'O'
        }
    ];

    //changes the names with the ones in the arguments
    function changeNames(playerOneNewName, playerTwoNewName){
        players[0].name = playerOneNewName;
        players[1].name = playerTwoNewName;
        playerOneDiv.textContent = playerOneNewName;
        playerTwoDiv.textContent = playerTwoNewName;
    }

    let activePlayer = players[0];

    //changes the active player
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

    //check if on the board there is one of the possible winning combinations above
    const checkWin = () => {
        for (const condition of winConditions){
            const [a, b, c] = condition;

            const cellValues = [
                board.getBoard()[a[0]][a[1]].getValue(),
                board.getBoard()[b[0]][b[1]].getValue(),
                board.getBoard()[c[0]][c[1]].getValue()
            ];

            if (cellValues.every(value => value !== '' && value === cellValues[0])){
                return true;
            }
        };

        return false;
    }

    //insertes the cross or the circle in the board
    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name}\'s puts sing in row n° ${row} and column n°${column}`);
        if(board.getCellValue(row, column) === ''){
            board.insertSign(row, column, getActivePlayer().sign);
            
            if(checkWin()){
                console.log(`${getActivePlayer().name} wins!`);
                return;
            } else {
                changePlayerTurn();
            printRound();
            }
        } else {
            console.log("Cell already Taken")
        }

        

    }   

    printRound();

    return{
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        changePlayerTurn,
        checkWin,
        changeNames
    };

}

//function responsible of the implementation of the gameController in the screen
function screenController(){

    const game = gameController();
    const boardDiv = document.querySelector('.board');
    const changePlayersName = document.querySelector('.change-name');
    const newGameButton = document.getElementById('new-game-button');
    const winnerDialog = document.getElementById('winner-dialog');

    function showWinDialog(winnerName) {
        
        const winnerElement = document.querySelector('.winner');
        
        const closeButton = document.getElementById('close-winner-dialog')

        winnerElement.textContent = `${winnerName} Wins!`;
        winnerDialog.setAttribute('open', 'open');

        closeButton.addEventListener('click', () => {
            winnerDialog.removeAttribute('open');
        })

    }

    function createCellButton(row, column){
        const cellButton =document.createElement('button');
        cellButton.classList.add('cell');
        cellButton.dataset.row = row;
        cellButton.dataset.column = column;
        return cellButton;
    }

    const updateScreen = () => {
        const board = game.getBoard();

        boardDiv.innerHTML = '';

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = createCellButton(rowIndex, columnIndex);
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton)
            })
        })

    }

    const nameDialog = document.getElementById('name-dialog');
    const changeNameButton = document.querySelector('.change-name');
    const submitButton = document.querySelector('.submit');
    const closeDialogButton = document.getElementById('close-name-dialog');
    // Function to open the dialog
    const openDialog = () => {
        nameDialog.showModal();
    };
    // Function to close the dialog
    const closeDialog = () => {
        nameDialog.close();
    };
    // Function to handle form submission and call changeName
    const handleSubmit = (event) => {
        event.preventDefault();
        const nameOne = document.getElementById('name-one').value;
        const nameTwo = document.getElementById('name-two').value;

        game.changeNames(nameOne, nameTwo);
        
        closeDialog();
    };
    changeNameButton.addEventListener('click', openDialog);
    closeDialogButton.addEventListener('click', closeDialog);
    submitButton.addEventListener('click', handleSubmit);

    function clickHandlerBoard(e){
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (selectedRow !== undefined && selectedColumn !== undefined){
            const row = parseInt(selectedRow);
            const column = parseInt(selectedColumn);
            if (!isNaN(row) && !isNaN(column) && game.getBoard()[row][column].getValue() === '') {
                game.playRound(row, column);
                

                if(game.checkWin()){
                    updateScreen();

                    showWinDialog(game.getActivePlayer().name);

                    boardDiv.removeEventListener('click', clickHandlerBoard);
                }else {
                    updateScreen();
                }
            }
        };
        
        
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();

    newGameButton.addEventListener('click', () => {
        winnerDialog.removeAttribute('open');
        screenController();
    });
}

screenController()  