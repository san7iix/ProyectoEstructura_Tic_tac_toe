var origBoard; //Variable del tablero
const huPlayer = 'O'; //Jugador humano
const aiPlayer = 'X'; //Máquina
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
] //Combinaciones ganadoras

const celdas = document.querySelectorAll('.cell'); //Crea una variable celdas

empezarJuego();

function empezarJuego() {
//Del documento->seleccione la clase endgame y asignele el estilo display none, osea, se muestre
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys()); //Creame un array de 9 posiciones
  for (var i = 0; i < celdas.length; i++) {
    celdas[i].innerText = ''; //Ponmelas vacías
    celdas[i].style.removeProperty('background-color'); //Quítale el fondo
    celdas[i].addEventListener('click', turnoClick, false); //Está pendiente cuando te hagan click sobre la celda y ejecuta la función turnoClick
  }
}

function turnoClick(square) {
  if (typeof origBoard[square.target.id] == 'number') {
    turno(square.target.id, huPlayer);
    if (!verificarEspacios()) turno(mejorMovimiento(), aiPlayer);
  }
}
//El primer parametro es la celda y el segundo el jugador puede ser maquina o humano
function turno(squareID, player) {
  origBoard[squareID] = player;//Aquí no dibuja
  document.getElementById(squareID).innerText = player;//Aquí dibuja
  let gameWon = verificar_gana(origBoard, player) //verificar si se ganó
  if (gameWon) gameOver(gameWon) //Pregunta si gana o se sigue jugando
}

//verificar si se puede seguir jugando
function verificar_gana(board, player) {
  let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {
        index: index,
        player: player
      };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "gray" : "silver"; //Aquí pone el fondo gris o plateado si existe un combo ganador
    document.getElementById(index).style.transition = "0.5s"; //Agrega una transición a la ventanita
  }

  for (var i = 0; i < celdas.length; i++) {
    celdas[i].removeEventListener('click', turnoClick, false); //Quitar la función de escucha para que no pueda hacer nada luego de ganar, empatar o perder
  }
  declararGanador(gameWon.player == huPlayer ? "¡Ganaste!" : "¡Perdiste!");
}

function declararGanador(jugador) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = jugador;
}


function cuadrosVacios() {
  return origBoard.filter(s => typeof s == 'number'); //Te avisa si ya no quedan cuadros vacíos
}

function mejorMovimiento() {
  return minimax(origBoard, aiPlayer).index; //Aquí es donde juega la máquina
}

function verificarEspacios() {
  if (cuadrosVacios().length == 0) {
    for (var i = 0; i < celdas.length; i++) {
      celdas[i].style.backgroundColor = "#f6f5f5";
      celdas[i].removeEventListener('click', turnoClick, false);
    }

    declararGanador("¡Empate!")
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var cuadrosVac = cuadrosVacios();

  if (verificar_gana(newBoard, huPlayer)) {
    return {
      score: -10
    };
  } else if (verificar_gana(newBoard, aiPlayer)) {
    return {
      score: 10
    };
  } else if (cuadrosVac.length === 0) {
    return {
      score: 0
    };
  }
  var movimientos = [];
  for (var i = 0; i < cuadrosVac.length; i++) {
    var move = {};
    move.index = newBoard[cuadrosVac[i]];
    newBoard[cuadrosVac[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[cuadrosVac[i]] = move.index;

    movimientos.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < movimientos.length; i++) {
      if (movimientos[i].score > bestScore) {
        bestScore = movimientos[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < movimientos.length; i++) {
      if (movimientos[i].score < bestScore) {
        bestScore = movimientos[i].score;
        bestMove = i;
      }
    }
  }

  return movimientos[bestMove];
}
