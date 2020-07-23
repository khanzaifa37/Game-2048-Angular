import { Component, ViewChildren, QueryList, HostListener, Input }  from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import {Observable} from 'rxjs';
import { DocumentSnapshot } from '@firebase/firestore-types';
import { CellComponent }                                            from '../cell/cell.component';
import { KEY_MAP }                                                  from '../constants/key-map';
import { ACTION_MAP, IOperationResult }                             from '../action-handler';
import { GameService }                                              from '../game.service';
import { Cell }                                                     from '../cell.model';
import * as Hammer from 'hammerjs';
export interface score { name: string,score:number }

@Component({
  selector:     'app-board',
  templateUrl:  './board.component.html',
  styleUrls:    ['./board.component.css']
})
export class BoardComponent {

  _db: AngularFirestore;
  scores:  Observable<any[]>;
  temp: Observable<any[]>;
  cells:    Cell[];
  gameOver: boolean = false;
  score:    number  = 0;
  gridSize: number  = 4;
  playerName: string="Player1";


  // @Input(val)
  onSwipe(evt) {
    const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';
    const y = Math.abs(evt.deltaY) > 40 ? (evt.deltaY > 0 ? 'down' : 'up') : '';

    const z=x+y;
    let   moveSuccessful = false;
    const direction      = KEY_MAP[z];

    if (this.gameOver || direction === undefined) {
      return;
    };

    this.game.move(direction)
    .subscribe(
      (result: IOperationResult) => {
        moveSuccessful = moveSuccessful || result.hasMoved;
      },console.error,
      () => {
        this.cells = this.game.cells;
        this.score = this.game.score;
        if (moveSuccessful) this.game.randomize(1, direction);
        if (!this.gameOver)
          this.gameOver = this.game.isGameOver;
      }
    );

}

  @HostListener('window:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    let   moveSuccessful = false;
    const direction      = KEY_MAP[event.keyCode];

    if (this.gameOver || direction === undefined) {
      return;
    };

    this.game.move(direction)
    .subscribe(
      (result: IOperationResult) => {
        moveSuccessful = moveSuccessful || result.hasMoved;
      },console.error,
      () => {
        this.cells = this.game.cells;
        this.score = this.game.score;
        if (moveSuccessful) this.game.randomize(1, direction);
        if (!this.gameOver)
          this.gameOver = this.game.isGameOver;
      }
    );
  }

  constructor(private game: GameService,db: AngularFirestore) {
    this.initGame(this.gridSize,db);
    // this.gridSize = game.gridSize;
  }
  addScore(name: string, score: number){
    if(score===0)
    return;
    let scoresCollection = this._db.collection<score>('leaderboard');
    scoresCollection.add({ name: name, score: score });
  }

  initGame(gridSize: number,db: AngularFirestore) {

    this.scores= db.collection<score>('leaderboard', ref => ref.orderBy('score','desc').limit(10)).valueChanges();
    this._db = db;
    this.gridSize = gridSize
    this.game.initializeGame(this.gridSize);
    this.cells    = this.game.cells;
    this.gameOver = false;
    this.game.randomize(1);

  }
  setPlayerName(playerName: string = this.playerName)
  {
    this.playerName=playerName;
    console.log(this.playerName);
   }
  restart(gridSize: number = this.gridSize) {
    // if (!gridSize)
    console.log(gridSize);
    this.addScore(this.playerName,this.score);
    this.score = 0;

    this.initGame(gridSize,this._db);
    // this.game.restart();
  }

  successHandler() {
    alert('You win!');
    this.gameOver = true;
  }
}
