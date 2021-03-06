const prefix = "!";

var openrequests = [
  // {
  //     challenger: message.author,
  //     gameID,
  //   },
];
var currentgames = [
  // {
  //     gameID,
  //     challenger: openrequests[gameIndex].challenger,
  //     accepter: message.author,
  //     board: new Array(9),
  //     status: "ongoing",
  //     current: "challenger" || "accepter",
  //   },
];

const handleCommand = (message) => {
  // If message doesn't start from "prefix" or it is from another bot then do nothing.
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Now we know that it is command so get command and arguments in diffrent variable
  const args = message.content.slice(prefix.length).trim().split(/ +/); // split every word with removing "prefix" from start
  const command = args.shift().toLowerCase(); // get the first word i.e command in different variable

  // If the command is for starting a new game.
  if (command === "start_ttt") {
    const gameIndex = openrequests.findIndex(
      (game) => game.challenger.id == message.author.id
    );

    // If user has already open challange
    if (gameIndex !== -1) {
      message.channel.send("You alredy have an open challange");
      return;
    }

    // If user has already ongoing challange
    const currentgameIndex = currentgames.findIndex(
      (game) =>
        game.challenger.id === message.author.id ||
        game.accepter.id === message.author.id
    );
    if (currentgameIndex !== -1) {
      message.channel.send("You alredy have an ongoing challange");
      return;
    }
    const gameID = Math.floor(Math.random() * 100000);
    openrequests.push({
      challenger: message.author,
      gameID,
    });
    message.channel.send(
      `Starting a tictactoe challange from ${message.author.username}
      To accept this challange type`
    );
    message.channel.send(`!accept_ttt ${gameID}`);
  }

  // If the command is for accepting a ongoing reqest
  if (command === "accept_ttt") {
    // Get the game ID from command
    var gameID = args[0];

    // Find the index of Game asked by the user if available
    const gameIndex = openrequests.findIndex((game) => game.gameID == gameID);

    // The game with gameID doesn't exists
    if (gameIndex === -1) {
      message.channel.send(
        "Invalid Game id. make sure you have propper GameId as a second argument."
      );
      return;
    }

    // challenger is trying to accept own challenge
    if (openrequests[gameIndex].challenger.id === message.author.id) {
      message.channel.send(
        "you can't accept your own challenge. Go find some friends. 😂"
      );
      return;
    }

    // If user has already open challange
    const gameIndexc = openrequests.findIndex(
      (game) => game.challenger.id == message.author.id
    );

    if (gameIndexc !== -1) {
      message.channel.send("You alredy have an open challange");
      return;
    }

    // If this user is already playing another game
    const currentgameIndex = currentgames.findIndex(
      (game) =>
        game.challenger.id === message.author.id ||
        game.accepter.id === message.author.id
    );
    if (currentgameIndex !== -1) {
      message.channel.send("You alredy have an ongoing challange");
      return;
    }
    // Start the Game process
    var gameData = {
      gameID,
      challenger: openrequests[gameIndex].challenger,
      accepter: message.author,
      board: new Array(9).fill("--"),
      status: "ongoing",
      current: "challenger",
    };

    // Add a new game to currentgames
    currentgames.push(gameData);

    // Remove the game from openrequests
    openrequests.splice(gameIndex, 1);

    // Show them game
    message.channel.send(
      `${gameData.challenger.username} -> " X " vs ${gameData.accepter.username} -> " O "
      Starting empty game
      Current move: ${gameData.challenger.username}
      -- | -- | --
      -- | -- | --
      -- | -- | --
      Fight
      
      To play use !m <index_of_row>[1,2,3] <index_of_column>[1,2,3]`
    );
  }

  // If the command is for move
  if (command === "m") {
    // Find if player is currently playing or not?
    const gameIndexC = currentgames.findIndex(
      (game) =>
        game.challenger.id === message.author.id &&
        game.current === "challenger"
    );
    const gameIndexA = currentgames.findIndex(
      (game) =>
        game.accepter.id === message.author.id && game.current === "accepter"
    );

    // If user is not in any current games
    if (gameIndexC === -1 && gameIndexA === -1) {
      message.channel.send("You are not part of any ongoing game.");
      return;
    }

    var gameIndex;
    var player;
    if (gameIndexA !== -1) {
      gameIndex = gameIndexA;
      player = "accepter";
    } else {
      gameIndex = gameIndexC;
      player = "challenger";
    }

    if (gameIndex === -1) {
      message.channel.send("Something went wrong.....");
      return;
    }
    // If less then two params are passed
    if (args.length < 2) {
      message.channel.send("Please at least provide 2 paramters");
      return;
    }
    const i = parseInt(args[0]);
    const j = parseInt(args[1]);

    // If args are not numbers
    if (isNaN(i) || isNaN(j)) {
      message.channel.send("Please provide only numbers...");
      return;
    }

    // If i and j are above 3 or below 0
    if (i < 0 || i > 3 || j < 0 || j > 3) {
      message.channel.send("Please enter values 1 or 2 or 3 as a argument.");
      return;
    }

    // If place is alredy played
    if (currentgames[gameIndex].board[(i - 1) * 3 + (j - 1)] !== "--") {
      message.channel.send("Place alredy played. Try another place.");
      return;
    }

    currentgames[gameIndex].board[(i - 1) * 3 + (j - 1)] =
      currentgames[gameIndex].current === "challenger" ? "X" : "O";
    currentgames[gameIndex].current =
      currentgames[gameIndex].current === "challenger"
        ? "accepter"
        : "challenger";

    var result = checkWin(currentgames[gameIndex].board);

    if (result === "draw") {
      message.channel.send("Game draw. Both are good. Keep it up.");
      currentgames.splice(gameIndex, 1);
      return;
    }
    if (result === "X") {
      message.channel.send(
        `Challanger ${currentgames[gameIndex].challenger.username} Won!!!🎊🎊🎊`
      );
      currentgames.splice(gameIndex, 1);
      return;
    }
    if (result === "O") {
      message.channel.send(
        `Accepter ${currentgames[gameIndex].accepter.username} Won!!!🎊🎊🎊`
      );
      currentgames.splice(gameIndex, 1);
      return;
    }
    // Show board to users
    message.channel.send(`${
      currentgames[gameIndex].challenger.username
    }(X) vs ${currentgames[gameIndex].accepter.username}(O)
    Set [${i}][${j}] to ${currentgames[gameIndex].board[(i - 1) * 3 + (j - 1)]}
    ${currentgames[gameIndex].board[0]} | ${
      currentgames[gameIndex].board[1]
    } | ${currentgames[gameIndex].board[2]}
    ${currentgames[gameIndex].board[3]} | ${
      currentgames[gameIndex].board[4]
    } | ${currentgames[gameIndex].board[5]}
    ${currentgames[gameIndex].board[6]} | ${
      currentgames[gameIndex].board[7]
    } | ${currentgames[gameIndex].board[8]}
    ${currentgames[gameIndex].current}'s move`);
  }

  // If player wants to quit game or close challanges
  if (command === "close_ttt") {
    var gameIndexOpen = openrequests.findIndex(
      (game) => game.challenger.id === message.author.id
    );
    if (gameIndexOpen !== -1) {
      openrequests.splice(gameIndexOpen, 1);
      message.channel.send("Closed your challenge.");
      return;
    }
    var gameIndexOngoing = currentgames.findIndex(
      (game) =>
        game.challenger.id === message.author.id ||
        game.accepter.id === message.author.id
    );
    if (gameIndexOngoing !== -1) {
      currentgames.splice(gameIndexOngoing, 1);
      message.channel.send(
        "Closed your current game. Inform someone who was playing with you."
      );
      return;
    }
  }

  // Help command for info
  if (command === "info_ttt") {
    message.channel.send(
      `List of commands
      - Start a challange with !start_ttt
      - Accept a challange with !accept_ttt <gameID>
          gameID was shared while starting a game
      - while in game to mark your move use !m <index_of_row>[1,2,3] <index_of_column>[1,2,3]
      - Close your challange or current game with !close_ttt
      
      There are very high possibalities that game might not work properly but I tried my best.
      If you want to contribute to this bot then take a tour here.
      https://github.com/PhoenixCreation/Discord_TicTacToe`
    );
  }
};

const checkWin = (oldboard) => {
  const board = [
    [oldboard[0], oldboard[1], oldboard[2]],
    [oldboard[3], oldboard[4], oldboard[5]],
    [oldboard[6], oldboard[7], oldboard[8]],
  ];

  // check X win
  var xwin = false;
  if (board[0][0] === "X" && board[0][1] === "X" && board[0][2] === "X") {
    xwin = true;
  }
  if (board[1][0] === "X" && board[1][1] === "X" && board[1][2] === "X") {
    xwin = true;
  }
  if (board[2][0] === "X" && board[2][1] === "X" && board[2][2] === "X") {
    xwin = true;
  }
  if (board[0][0] === "X" && board[1][0] === "X" && board[2][0] === "X") {
    xwin = true;
  }
  if (board[0][1] === "X" && board[1][1] === "X" && board[2][1] === "X") {
    xwin = true;
  }
  if (board[0][2] === "X" && board[1][2] === "X" && board[2][2] === "X") {
    xwin = true;
  }
  if (board[0][0] === "X" && board[1][1] === "X" && board[2][2] === "X") {
    xwin = true;
  }
  if (board[0][2] === "X" && board[1][1] === "X" && board[2][0] === "X") {
    xwin = true;
  }

  if (xwin) {
    return "X";
  }

  // check O win
  var owin = false;
  if (board[0][0] === "O" && board[0][1] === "O" && board[0][2] === "O") {
    owin = true;
  }
  if (board[1][0] === "O" && board[1][1] === "O" && board[1][2] === "O") {
    owin = true;
  }
  if (board[2][0] === "O" && board[2][1] === "O" && board[2][2] === "O") {
    owin = true;
  }
  if (board[0][0] === "O" && board[1][0] === "O" && board[2][0] === "O") {
    owin = true;
  }
  if (board[0][1] === "O" && board[1][1] === "O" && board[2][1] === "O") {
    owin = true;
  }
  if (board[0][2] === "O" && board[1][2] === "O" && board[2][2] === "O") {
    owin = true;
  }
  if (board[0][0] === "O" && board[1][1] === "O" && board[2][2] === "O") {
    owin = true;
  }
  if (board[0][2] === "O" && board[1][1] === "O" && board[2][0] === "O") {
    owin = true;
  }

  if (owin) {
    return "O";
  }

  // check draw
  var draw = true;
  for (let i = 0; i < oldboard.length; i++) {
    const element = oldboard[i];
    if (element === "--") {
      draw = false;
    }
  }
  if (draw) {
    return "draw";
  }

  // return nothing
  return "none";
};

export default handleCommand;
