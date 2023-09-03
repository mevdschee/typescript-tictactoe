import { Board } from "./Board";

export class Player {

    private board: Board;

    public constructor(gameId: string) {
        const _this = this;
        this.board = new Board();
        const game = document.getElementById(gameId);
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
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button) => {
            if (button.id == "reset") {
                button.addEventListener('click', () => {
                    _this.reset();
                }, true);
            } else {
                button.addEventListener('click', () => {
                    const x = parseInt(button.getAttribute('data-x') as string);
                    const y = parseInt(button.getAttribute('data-y') as string);
                    _this.click(x, y);
                }, true);
            }
        });
    }

    public reset(): void {
        this.board = new Board();
        this.redraw();
    }

    public redraw(): void {
        for (var y = 0; y < this.board.size; y++) {
            for (var x = 0; x < this.board.size; x++) {
                const button = document.getElementById('button_' + x + '_' + y) as HTMLElement;
                button.innerHTML = this.board.fields[y][x];
                button.style.color = 'inherit';
            }
        }
    }

    public click(x: number, y: number): void {
        if (this.board.won() || this.board.tied()) {
            return;
        }
        if (this.board.fields[y][x] != this.board.empty) {
            return;
        }
        this.board = this.board.move(x, y);
        this.redraw();
        const move = this.board.best();
        if (move) {
            this.board = this.board.move(move.x, move.y);
        }
        this.redraw();
        const winning = this.board.won();
        if (winning) {
            winning.forEach((move) => {
                const button = document.getElementById('button_' + move.x + '_' + move.y) as HTMLElement;
                button.style.color = 'red';
            });
        }
    }

}
