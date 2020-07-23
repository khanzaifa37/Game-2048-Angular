import { CommonModule }             from '@angular/common';
import { NgModule }                 from '@angular/core';
import { MatButtonModule }          from '@angular/material/button';
import { MatFormFieldModule}        from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { BrowserModule }            from '@angular/platform-browser';
import { AngularFireModule }        from '@angular/fire';
import { AngularFirestoreModule }   from '@angular/fire/firestore';
import { AngularFirestore }         from '@angular/fire/firestore';
import { CellComponent }            from './cell/cell.component';
import { BoardComponent }           from './board/board.component';
import { GameService }              from './game.service';

import * as Hammer                  from 'hammerjs';
import { HammerModule,HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}
const firebaseConfig = {
  apiKey: "AIzaSyBhoNgHu0A1XNlU7i-idXl9rCgtLKq8Ji8",
  authDomain: "angular-2048.firebaseapp.com",
  databaseURL: "https://angular-2048.firebaseio.com",
  projectId: "angular-2048",
  storageBucket: "angular-2048.appspot.com",
  messagingSenderId: "444671412743",
  appId: "1:444671412743:web:ef4025aa043fa2a872b8a2",
  measurementId: "G-VC5LKVELQP"
};

@NgModule({
  imports:      [ CommonModule,
                  AngularFireModule.initializeApp(firebaseConfig),
                  AngularFirestoreModule,
                  BrowserModule,
                  HammerModule,
                  MatButtonModule,
                  MatFormFieldModule,
                  MatInputModule
                ],
  declarations: [CellComponent, BoardComponent],
  exports:      [CellComponent, BoardComponent],
  providers:    [GameService,{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: MyHammerConfig,
  }]
})
export class CoreModule { }
