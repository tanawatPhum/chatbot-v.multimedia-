import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,IonicApp,MenuController,AlertController,App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { BotUi2 } from '../pages/bot-ui-flow2/bot-ui-flow2';
import { Chats } from '../pages/chats/chats';
import { FaceRecognition } from '../pages/chats/faceRecognition/faceRecognition';
import { ChatService } from '../service/chat.service';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { globalVar } from '../global/globalVar';
import { ChatModel } from '../model/chats.model';
declare var cordova:any;
declare var window:any;


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = FaceRecognition;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public chatService:ChatService,
    private ionicApp: IonicApp,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private app: App,
    private androidPermissions: AndroidPermissions
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'BOT UI 1', component: Chats },
      { title: 'BOT UI 2', component: BotUi2 },
      { title: 'Face Recognition', component: FaceRecognition }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // console.info("Start App");
      this.chatService.voiceDetector('initial');
      this.splashScreen.hide();            
      // cordova.plugins.facerecognition.startRecognizer(globalVar.requestFaceRegonitionUrl+'/face/verify','initial',(ev)=>this.success(ev),(ev)=>this.error(ev));
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.requestPermissionsForApp();
    //   this.platform.registerBackButtonAction(() => {
    //     let activePortal = this.ionicApp._loadingPortal.getActive() ||
    //     this.ionicApp._modalPortal.getActive() ||
    //     this.ionicApp._toastPortal.getActive() ||
    //     this.ionicApp._overlayPortal.getActive();

    //   if (activePortal) {
    //     activePortal.dismiss();
    //   }
    //   else if (this.menuCtrl.isOpen()) {
    //     this.menuCtrl.close();
    //   }
    // });
      //if open root app (first page) can detect

      // window.plugins.OnDestroyPlugin.setEventListener (()=>{
      //   this.chatService.voiceDetector('destroy');
      // });
    });
    

  }
  requestPermissionsForApp(){
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(()=>{
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
    }).catch(()=>{
      
    });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  success(res) {

  }
  error(err) {
  }
}
