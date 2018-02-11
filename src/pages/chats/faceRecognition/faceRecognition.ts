import { Component, ViewChild, OnInit, Input, Output, EventEmitter,OnChanges } from '@angular/core';
import { NavController, Content, Platform,ActionSheetController,AlertController,LoadingController } from 'ionic-angular';
import { FaceRecognitionSevice } from '../../../service/faceRecognition.service';
import { Chats } from '../chats';
import { globalVar } from '../../../global/globalVar';
import { ChatService } from '../../../service/chat.service';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { AndroidPermissions } from '@ionic-native/android-permissions';
declare var cordova:any;
declare var window:any;
@Component({
    selector: 'faceRecognition-page',
    templateUrl: 'faceRecognition.html',
    styleUrls: ['/faceRecognition.scss']
})
export class FaceRecognition implements OnInit {
    private faceUser:string;
    private hasDetect:boolean;
    private textDisplay:string;
    constructor(
        private faceRecognitionSevice:FaceRecognitionSevice,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private navCtrl: NavController,
        private platform: Platform,
        private chatService:ChatService,
        private speechToText: SpeechRecognition,
        private androidPermissions: AndroidPermissions
    ) {
    }
    ngOnInit() {
        this.faceUser = "assets/img/avatar.png";
        this.hasDetect =true;
        this.textDisplay = "ถ่ายใบหน้าของคุณ เพื่อยืนยันตัวตน";
       
        // this.chatService.voiceDetector('initial');
    }

    private takePicture(){
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA).then(()=>{
            cordova.plugins.facerecognition.startRecognizer(globalVar.requestFaceRegonitionUrl+'/face/verify','process',(ev)=>this.success(ev),(ev)=>this.error(ev));
        });
      
        // this.faceRecognitionSevice.requestPicture().then(()=>{
        //     let loading = this.loadingCtrl.create({
        //         content: 'ระบบกำลังประมวลผล รอสักครู่...'
        //     });
        //     loading.present();
        //     this.textDisplay = this.faceRecognitionSevice.nameUser;
        //     this.facePicture = this.faceRecognitionSevice.facePicture;
        //     this.hasDetect = false;
        //     setTimeout(()=>{
        //         loading.dismiss();
        //         this.navCtrl.push(Chats);
        //     },2500)
        // }).catch((err)=>{
        //     this.hasDetect = true;
        //     this.facePicture = "assets/img/avatar.png";
        //     this.alertCtrl.create({
        //         title: `คำเตือน`,
        //         message: `ไม่สามารถระบุตัวตนของคุณได้`,
        //     }).present();
        // })
    }
    success(res){
        // let resDetect = JSON.parse(res.response);
        console.log("success",res);
        //init info user
        this.faceRecognitionSevice.idUser = res.idUser;
        this.faceRecognitionSevice.nameUser = res.nameUser;
        this.faceRecognitionSevice.faceUser = res.faceUser;
        this.faceUser = res.faceUser;
        // after can detect textDisplay as nameUser
        this.textDisplay = res.nameUser;
        this.hasDetect = false;
    }
    error(err){
        console.log("err",err);
    } 
    goToChats(){
        // this.navCtrl.push(Chats);
        this.chatService.login().subscribe((res)=>{
            this.faceRecognitionSevice.idToken = res.id_token;
            this.navCtrl.push(Chats);
        },(err)=>{
            this.chatService.throwException(globalVar.typeOfError.networkFail);
        });
    }
}