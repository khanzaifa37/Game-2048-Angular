import { CommonModule }             from '@angular/common';
import { NgModule }                 from '@angular/core';
import { BrowserModule }            from '@angular/platform-browser';
import { AngularFireModule }        from '@angular/fire';
import { AngularFirestoreModule }   from '@angular/fire/firestore';
import { AngularFirestore }         from '@angular/fire/firestore';
import { CellComponent }            from './cell/cell.component';
import { BoardComponent }           from './board/board.component';
import { GameService }              from './game.service';
import { MaterialModule }           from './material.module';
import * as Hammer                  from 'hammerjs';
import { HammerModule,HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: ''
};

@NgModule({
  imports:      [ CommonModule,
                  AngularFireModule.initializeApp(firebaseConfig),
                  AngularFirestoreModule,
                  BrowserModule,
                  HammerModule,
                  MaterialModule,

                ],
  declarations: [CellComponent, BoardComponent],
  exports:      [CellComponent, BoardComponent],
  providers:    [GameService,{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: MyHammerConfig,
  }]
})
export class CoreModule { }
