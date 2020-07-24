
import {zip as observableZip, from as observableFrom,  Observable } from 'rxjs';

import {switchMap, map, tap, bufferCount} from 'rxjs/operators';
import { Injectable }                   from '@angular/core';

import { Cell }                         from './cell.model';
import { Direction }                    from './enums/direction';
import { KEY_MAP }                      from './constants/key-map';
import { ACTION_MAP, IOperationResult } from './action-handler';









const rand           = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const sameValueCells = (cell1: Cell, cell2: Cell) => cell1.value === cell2.value;

@Injectable()
export class GameService {

  gridSize:number;

  cells:   Cell[];  // = Array(this.gridSize*this.gridSize).fill(null).map(_ => new Cell());
  rows:    Cell[][] = [];
  columns: Cell[][] = [];
  score:   number   = 0;

  private hasMoves() {
    let hasColumnMoves = false,
        hasRowMoves    = false,

        _columns        = Array(this.gridSize).fill(null),
        _rows           = Array(this.gridSize).fill(null);

    _columns = _columns.map((_,i) => this.columns[i]);
    _rows    = _rows   .map((_,i) => this.rows[i]),

    _columns.map((x) => {
      x.map((_,i) => {
        if (i < this.gridSize - 1 && sameValueCells(x[i], x[i+1]))
          hasColumnMoves = true;
      });
    });

    _rows.map((x) => {
      x.map((_,i) => {
        if (i < this.gridSize - 1 && sameValueCells(x[i], x[i+1]))
          hasColumnMoves = true;
      });
    });

    return hasRowMoves || hasColumnMoves;
  }

  private hasEmptyCells(): boolean {
    return this.cells.reduce((acc, cell) =>  acc || cell.isEmpty, false);
  }

  get isGameOver(): boolean {
    return !this.hasEmptyCells() && !this.hasMoves();
  }

  // restart() {
  //   this.cells = Array(this.gridSize*this.gridSize).fill(null).map(_ => new Cell());
  //   this.score = 0;
  //   this.initializeGame(this.gridSize);
  // }

  initializeGame(gridSize: number) {
    if (typeof gridSize === "string") gridSize = parseInt(gridSize);
    this.gridSize = gridSize;
    this.cells = Array(this.gridSize*this.gridSize).fill(null).map(_ => new Cell());
    this.score = 0;

    observableFrom(this.cells).pipe(
      bufferCount(this.gridSize),
      bufferCount(this.gridSize),
      tap(rows => this.rows = rows),
      map(rows => rows.map(row => observableFrom(row))),
      switchMap(obsArray => observableZip(...obsArray)),
      bufferCount(this.gridSize),)
      .subscribe(columns => this.columns = columns)
  }

  constructor() {
    // this.initializeGame();
  }

  move(direction: Direction): Observable<any> {
    return ACTION_MAP[direction](direction === Direction.Left || direction === Direction.Right ? this.columns : this.rows).pipe(
      map((result: IOperationResult) => { this.score += result.mergeScore; return result; }));
  }

  randomize(amount: number, direction: number = -1) {
    let keepGoing      = this.hasEmptyCells(),
        generatedCells = 0;
    while (keepGoing) {
      const randIndex  = rand(0, (this.gridSize*this.gridSize) - 1),
            randValue  = rand(1, 2) === 1 ? 2 : 4,
            cell: Cell = this.cells[randIndex];

      if (!cell.value && this.checkIdx(randIndex, direction)) {
        cell.value = randValue;
        generatedCells++;

        if (generatedCells >= amount)
          keepGoing = false;
      }
    }
  }
  checkIdx(idx: number, direction: number): boolean {
    return !(direction == 1 && idx > this.gridSize - 1 ||
             direction == 0 && idx < this.gridSize * (this.gridSize - 1) ||
             direction == 3 && idx % this.gridSize != 0 ||
             direction == 2 && idx % this.gridSize != 3)
  }
}
