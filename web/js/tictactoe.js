define("Move", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Move = void 0;
    var Move = /** @class */ (function () {
        function Move(x, y) {
            this.x = x;
            this.y = y;
        }
        return Move;
    }());
    exports.Move = Move;
});
define("Board", ["require", "exports", "Move"], function (require, exports, Move_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Board = void 0;
    var Board = /** @class */ (function () {
        function Board(other) {
            if (other) {
                this.player = other.player;
                this.opponent = other.opponent;
                this.empty = other.empty;
                this.size = other.size;
            }
            else {
                this.player = 'X';
                this.opponent = 'O';
                this.empty = '.';
                this.size = 3;
            }
            this.fields = [];
            for (var y = 0; y < this.size; y++) {
                this.fields[y] = [];
                for (var x = 0; x < this.size; x++) {
                    if (other) {
                        this.fields[y][x] = other.fields[y][x];
                    }
                    else {
                        this.fields[y][x] = this.empty;
                    }
                }
            }
        }
        Board.prototype.move = function (x, y) {
            var _a;
            var board = new Board(this);
            board.fields[y][x] = board.player;
            _a = [board.opponent, board.player], board.player = _a[0], board.opponent = _a[1];
            return board;
        };
        Board.prototype.won = function () {
            var winning;
            // horizontal
            for (var y = 0; y < this.size; y++) {
                winning = [];
                for (var x = 0; x < this.size; x++) {
                    if (this.fields[y][x] == this.opponent) {
                        winning.push(new Move_1.Move(x, y));
                    }
                }
                if (winning.length == this.size) {
                    return winning;
                }
            }
            // vertical
            for (var x = 0; x < this.size; x++) {
                winning = [];
                for (var y = 0; y < this.size; y++) {
                    if (this.fields[y][x] == this.opponent) {
                        winning.push(new Move_1.Move(x, y));
                    }
                }
                if (winning.length == this.size) {
                    return winning;
                }
            }
            // diagonal
            winning = [];
            for (var y = 0; y < this.size; y++) {
                x = y;
                if (this.fields[y][x] == this.opponent) {
                    winning.push(new Move_1.Move(x, y));
                }
            }
            if (winning.length == this.size) {
                return winning;
            }
            winning = [];
            for (var y = 0; y < this.size; y++) {
                var x = this.size - 1 - y;
                if (this.fields[y][x] == this.opponent) {
                    winning.push(new Move_1.Move(x, y));
                }
            }
            if (winning.length == this.size) {
                return winning;
            }
            return false;
        };
        Board.prototype.tied = function () {
            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    if (this.fields[y][x] == this.empty) {
                        return false;
                    }
                }
            }
            return true;
        };
        Board.prototype.minimax = function (player) {
            if (this.won()) {
                if (player)
                    return [-1, false];
                else
                    return [+1, false];
            }
            else if (this.tied()) {
                return [0, false];
            }
            if (player) {
                var best = [-2, false];
                for (var y = 0; y < this.size; y++) {
                    for (var x = 0; x < this.size; x++) {
                        if (this.fields[y][x] == this.empty) {
                            var value = this.move(x, y).minimax(!player)[0];
                            if (value > best[0]) {
                                best = [value, new Move_1.Move(x, y)];
                            }
                        }
                    }
                }
            }
            else {
                var best = [+2, false];
                for (var y = 0; y < this.size; y++) {
                    for (var x = 0; x < this.size; x++) {
                        if (this.fields[y][x] == this.empty) {
                            var value = this.move(x, y).minimax(!player)[0];
                            if (value < best[0]) {
                                best = [value, new Move_1.Move(x, y)];
                            }
                        }
                    }
                }
            }
            return best;
        };
        Board.prototype.best = function () {
            return this.minimax(true)[1];
        };
        return Board;
    }());
    exports.Board = Board;
});
define("Player", ["require", "exports", "Board"], function (require, exports, Board_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Player = void 0;
    var Player = /** @class */ (function () {
        function Player(gameId) {
            var _this = this;
            this.board = new Board_1.Board();
            var game = document.getElementById(gameId);
            if (!game) {
                throw "Cannot find element with id: " + gameId;
            }
            var html = '';
            for (var y = 0; y < this.board.size; y++) {
                for (var x = 0; x < this.board.size; x++) {
                    html += '<button id="button_' + x + '_' + y + '" data-x="' + x + '" data-y="' + y + '">';
                    html += this.board.fields[y][x];
                    html += '</button>';
                }
                html += '<br>';
            }
            html += '<button id="reset">Reset</button>';
            game.innerHTML = html;
            var buttons = document.querySelectorAll('button');
            buttons.forEach(function (button) {
                if (button.id == "reset") {
                    button.addEventListener('click', function () {
                        _this.reset();
                    }, true);
                }
                else {
                    button.addEventListener('click', function () {
                        var x = parseInt(button.getAttribute('data-x'));
                        var y = parseInt(button.getAttribute('data-y'));
                        _this.click(x, y);
                    }, true);
                }
            });
        }
        Player.prototype.reset = function () {
            this.board = new Board_1.Board();
            this.redraw();
        };
        Player.prototype.redraw = function () {
            for (var y = 0; y < this.board.size; y++) {
                for (var x = 0; x < this.board.size; x++) {
                    var button = document.getElementById('button_' + x + '_' + y);
                    button.innerHTML = this.board.fields[y][x];
                    button.style.color = 'auto';
                }
            }
        };
        Player.prototype.click = function (x, y) {
            if (this.board.won() || this.board.tied()) {
                return;
            }
            if (this.board.fields[y][x] != this.board.empty) {
                return;
            }
            this.board = this.board.move(x, y);
            this.redraw();
            var move = this.board.best();
            if (move) {
                this.board = this.board.move(move.x, move.y);
            }
            this.redraw();
            var winning = this.board.won();
            if (winning) {
                winning.forEach(function (move) {
                    var button = document.getElementById('button_' + move.x + '_' + move.y);
                    button.style.color = 'red';
                });
            }
        };
        return Player;
    }());
    exports.Player = Player;
});
define("index", ["require", "exports", "Player"], function (require, exports, Player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new Player_1.Player('game');
});
//# sourceMappingURL=tictactoe.js.map