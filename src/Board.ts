import { Move } from "./Move";

type BestMove = [score: number, move: Move | false];

export class Board {

    public player: string;
    public opponent: string;
    public empty: string;
    public size: number;
    public fields: string[][];

    public constructor(other?: Board) {
        if (other) {
            this.player = other.player;
            this.opponent = other.opponent;
            this.empty = other.empty;
            this.size = other.size;
        } else {
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
                } else {
                    this.fields[y][x] = this.empty;
                }
            }
        }
    }

    public move(x: number, y: number): Board {
        var board = new Board(this);
        board.fields[y][x] = board.player;
        [board.player, board.opponent] = [board.opponent, board.player];
        return board;
    }

    public won(): Move[] | false {
        var winning: Move[];
        // horizontal
        for (var y = 0; y < this.size; y++) {
            winning = [];
            for (var x = 0; x < this.size; x++) {
                if (this.fields[y][x] == this.opponent) {
                    winning.push(new Move(x, y));
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
                    winning.push(new Move(x, y));
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
                winning.push(new Move(x, y));
            }
        }
        if (winning.length == this.size) {
            return winning;
        }
        winning = [];
        for (var y = 0; y < this.size; y++) {
            var x = this.size - 1 - y;
            if (this.fields[y][x] == this.opponent) {
                winning.push(new Move(x, y));
            }
        }
        if (winning.length == this.size) {
            return winning;
        }
        return false;
    }

    public tied(): boolean {
        for (var y = 0; y < this.size; y++) {
            for (var x = 0; x < this.size; x++) {
                if (this.fields[y][x] == this.empty) {
                    return false;
                }
            }
        }
        return true;
    }

    private minimax(player: boolean): BestMove {
        if (this.won()) {
            if (player) return [-1, false];
            else return [+1, false]
        } else if (this.tied()) {
            return [0, false];
        }
        if (player) {
            var best: BestMove = [-2, false];
            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    if (this.fields[y][x] == this.empty) {
                        var value = this.move(x, y).minimax(!player)[0];
                        if (value > best[0]) {
                            best = [value, new Move(x, y)];
                        }
                    }
                }
            }
        } else {
            var best: BestMove = [+2, false];
            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    if (this.fields[y][x] == this.empty) {
                        var value = this.move(x, y).minimax(!player)[0];
                        if (value < best[0]) {
                            best = [value, new Move(x, y)];
                        }
                    }
                }
            }
        }
        return best
    }

    public best(): Move | false {
        return this.minimax(true)[1];
    }

}