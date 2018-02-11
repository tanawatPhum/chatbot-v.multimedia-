import { Component, ViewChild, OnInit, Output, EventEmitter, OnDestroy, trigger, state, style, animate, transition, NgZone, Renderer, ElementRef, ChangeDetectorRef, HostListener, ViewContainerRef } from '@angular/core';
import { NavController, Content, Platform, ToastController, LoadingController, AlertController, Slides, NavParams } from 'ionic-angular';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { ChatModel, items, raw } from '../../model/chats.model';
import { ChatService } from '../../service/chat.service';
import { globalVar } from '../../global/globalVar';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { FaceRecognitionSevice } from '../../service/faceRecognition.service';
import 'rxjs/Rx';
import { Observable, Subject } from 'rxjs';
import { FaceRecognition } from './faceRecognition/faceRecognition';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { templateModel } from '../../model/template.model';
import { DataMakeService } from '../../service/dataMake.service';
import { DynamicHtmlPage } from '../dynamic-html/dynamic-html';
declare var cordova: any;
declare var window: any;
declare var document: any;
@Component({
  selector: 'chats-page',
  templateUrl: 'chats.html',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translate3d(0,100px,0)'

        }),
        animate('0.3s ease-in', style({
          opacity: 1,
          transform: 'translate3d(0,0,0)'
        }))
      ]),
      transition(':leave', [
        animate('0s ease-in', style({
          opacity: 0,
          transform: 'translate3d(0,0,0)'
        }))
      ])
    ])
  ]
})
export class Chats implements OnInit, OnDestroy {
  @ViewChild(Content) content: Content;
  @ViewChild('myElement') myElem;
  @ViewChild('Sildes') slides: Slides;

  private animator: AnimationBuilder;
  private inputMessage: string;
  private inputMessageMic: string = "กำลังฟัง...";
  private iconHandleInput: string = "send";//defalut icon mic // mic is microphone
  private allMessages: ChatModel[] = new Array<ChatModel>();
  private message: ChatModel = new ChatModel();
  private currentMessages: ChatModel = new ChatModel();
  private loading: boolean = false;
  private dateOfSuccessOrder: Date;
  private micState: string = "michide";
  private micActive: string = "mic-nonactive";
  private micColor: string = "mic-color-nonactive";

  private selectItem: Subject<boolean> = new Subject();
  private cancelOrderedItem: Subject<boolean> = new Subject();
  private upadateEvenFromVoiceDetector: Subscription;
  private speechToTextServ: Subscription;
  private timeOut: number;
  private page: string;
  private templateJson: any;
  private templateHtml: any;
  private openPopup: boolean = false;
  private slideItem: Subject<boolean> = new Subject();

  private openPopover: boolean = false;
  private openPopoverContent: Subject<boolean> = new Subject();
  private disableScroll: boolean = false;
  private nextSlide: Subject<boolean> = new Subject();
  private openBackDrop: boolean = false;
  private stopYoutube: Subject<boolean> = new Subject();
  private playYoutube: Subject<boolean> = new Subject();
  private popoverContentIsUsed:boolean = false;
  private hideFooter:boolean =false;
  private messageWait:string ="กำลังฟัง...";
  private disableMic:boolean = false;
  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    private animationService: AnimationService,
    private chatService: ChatService,
    private platform: Platform,
    private speechToText: SpeechRecognition,
    private faceRecognitionSevice: FaceRecognitionSevice,
    private zone: NgZone,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private renderer: Renderer,
    private sanitizer: DomSanitizer,
    private elRef: ElementRef,
    private cdRef: ChangeDetectorRef,
    public alertCtrl: AlertController,
    public dataMakeService: DataMakeService
  ) {
    this.animator = animationService.builder();
    this.dateOfSuccessOrder = new Date();
  }
  ngOnInit() {
     this.chatService.voiceDetector('start');

    // this.navCtrl.viewDidEnter.subscribe((res)=>{
    //   console.log(res);
    // })
    // this.navCtrl.viewWillUnload.subscribe((res)=>{
    //   console.log("xxxxxxxxx");
    // })
    this.chatService.upadateEventAction().subscribe((res) => {
     this.send(res);
      console.log(res);
    });
    // this.navCtrl.viewWillEnter.subscribe(()=>{
    //   if(this.openBackDrop){
    //     this.openMic();
    //   }
    // })


    // if(this.navParams.get("inputMessage")){
    //   console.log(this.navParams.get("inputMessage"));
    //   this.send(this.navParams.get("inputMessage"));
    // }
    // setInterval(()=>{
    //  this.content.resize();
    // })
    // if(this.navParams.get("forms")){
    // console.log(this.navParams.get("forms")[1].test.value)
    // let form = this.navParams.get("forms");
    // console.log(form.getElementById("myForm2"));
    // } 

    //push first message bot 
    this.chatService.mapDataToModelV3(globalVar.chatterTypeBot, "ฉันสามารถช่วยอะไรคุณได้", null).then((messageBot) => {
      if (this.platform.is("mobileweb")) {
        this.loading = false;
        this.allMessages.push(messageBot);
      } else {
        this.loading = true;
        this.chatService.getTextToSpeech("สวัสดี").then((res) => {
          this.chatService.getTextToSpeech("ฉันสามารถช่วยอะไรคุณได้").then((res) => {
            this.allMessages.push(messageBot);
            this.loading = false;

            // this.openMic();
            this.observEventVoiceDetector();
          });
        });
      }
      console.log(messageBot);
    });



    // this.platform.resume.subscribe((res)=>{
    // this.chatService.voiceDetector('stop');
    // });
    // this.navCtrl.viewDidEnter.subscribe((event)=>{
    // this.chatService.voiceDetector('start');
    // console.info('%c👉 Component Page :', 'background:blue;color:white', event.name);
    // event.data && console.info('👉 Params Data :', event.data);
    // });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad chats');
  }
  ionViewDidEnter(){
    if(this.openBackDrop){
      this.popoverContentIsUsed = false;
      this.openMic();
    }
    console.log('ionViewDidEnter chats');
  }
  ngOnDestroy() {
    console.info('%c👉 Component Page :', 'background:blue;color:white', "destroy");
    this.upadateEvenFromVoiceDetector.unsubscribe();
    this.chatService.clearSubject();
    this.chatService.voiceDetector('leave');
    this.speechToText.stopListening();
    // this.navCtrl.pop();
  }
  private observEventVoiceDetector() {
    this.upadateEvenFromVoiceDetector = this.chatService.upadateEvenFromVoiceDetector().subscribe((event) => {
      this.openMic();
      console.log("eventStatus", event);
    });
  }
  private animateElem() {
    this.animator.setType('flipInX').show(this.myElem.nativeElement);
  }
  //detect input change
  // private inputMessageChange() {
  //   if (!this.inputMessage) {
  //     this.iconHandleInput = "mic"
  //   } else {
  //     this.iconHandleInput = "send"
  //   }
  // }
  // private onKey() {
  //   this.micState = "michide"
  //   setTimeout(() => {
  //     this.content.resize();
  //     this.autoScroll();
  //   }, 500);
  // }
  // event by cilck
  // private inputByClick() {
  //   if (this.iconHandleInput == "mic") {
  //     if (!this.platform.is("mobileweb")) {
  //       this.chatService.voiceDetector('stop');
  //     } else {
  //       this.micState = "micshow";
  //       this.activeMic();
  //     }

  //   } else {
  //     this.loading = true; //waiting for bot process
  //     this.micState = "michide";
  //     this.processMesseage(this.inputMessage);
      // this.chatService.getAllChats(this.inputMessage).subscribe((res) => {
      //   //ถ้า messeage ก่อนหน้า มีปุ่ม ให้ diable ปุ่ม
      //   this.disableButtonMessageBefore();
      //   //push message user
      //   this.chatService.mapDataToModel(globalVar.chatterTypeUser, this.inputMessage, null, null).then((messageUser) => {
      //     this.zone.run(() => {
      //       this.allMessages.push(messageUser);
      //     });
      //   });
      //   console.info("Bot Response", res);
      //   //push message bot
      //   this.chatService.mapDataToModel(globalVar.chatterTypeBot, res.msg, null, res).then((messageBot) => {
      //     if (messageBot.raw.type == globalVar.typeOfMessage.listOrder) {
      //       messageBot.message = messageBot.raw.ed;
      //     }
      //     if (messageBot.raw.type == globalVar.typeOfMessage.checkOut) {
      //       this.chatService.setInsertItem("22").subscribe((itemList) => {
      //         console.log(itemList);
      //         if (itemList.raw.type != globalVar.typeOfMessage.noOrdered) {
      //           itemList.raw.items.forEach((item, index) => {
      //             this.chatService.addToCart(item.product_id, item.qty).subscribe(() => {
      //               console.log("finish add to cart");
      //               if (index === itemList.raw.items.length - 1) {
      //                 this.sendTextToSpeech(messageBot).then((res) => {
      //                   this.inputMessage = "";
      //                   this.loading = false;
      //                   if (!this.platform.is("mobileweb")) {
      //                     console.log("goToOpen Uearn");
      //                     window.open('uearn://cart-page', '_system');
      //                   }
      //                   console.log("success to commit", res);
      //                 });
      //               }
      //             }, (err) => {
      //               this.throwException(globalVar.typeOfError.general);
      //             });
      //           });
      //         } else {
      //           this.sendTextToSpeech(messageBot);
      //         }
      //       }, (err) => {
      //         this.throwException(globalVar.typeOfError.general);
      //       });
      //     } else {
      //       this.sendTextToSpeech(messageBot);
      //     }
      //   });
      // }, (err) => {
      //   this.throwException(globalVar.typeOfError.networkFail);
      // });
  //   }
  //   setTimeout(() => {
  //     this.content.resize();
  //     this.autoScroll();
  //   }, 500)

  // }
  // processMesseage(message: string) {
  //   if (message != "ถัดไป") {
  //     this.chatService.getTemplate(message).subscribe((res) => {
  //       if (this.inputMessage) {
  //         this.chatService.mapDataToModel(globalVar.chatterTypeUser, this.inputMessage, null, null).then((messageUser) => {
  //           this.zone.run(() => {
  //             this.allMessages.push(messageUser);
  //           });
  //         });
  //       }
  //       this.chatService.mapDataToModelV2(globalVar.chatterTypeBot, null, res).then((messageBot) => {
  //         this.zone.run(() => {
  //           console.log(messageBot);
  //           this.processTemplate(messageBot);
  //           // currentMessages
  //           this.loading = false;
  //           this.inputMessage = "";
  //           this.autoScroll();

  //           this.allMessages.push(messageBot);
  //           if (!this.platform.is("mobileweb")) {
  //             this.chatService.getTextToSpeech(messageBot.message);
  //           }
 
  //         });
  //       })
  //     });
  //   } else {
  //     this.slideItem.next(true);
  //     this.loading = false;
  //     this.inputMessage = "";
  //   }

  // }
  // processTemplate(message: ChatModel) {
  //   console.log(message);
    // if(message.hasOwnProperty('template')){
    //   if(message.template.json&&message.template.json.length>0){


    //       this.templateJson = message.template.json;
    //       this.templateJson.forEach(element => {
    //         if(element.tag=='video'){
    //           this.openPopup = true;
    //         } 
    //       });
    //       // console.log(this.templateJson);
    //   }else if(message.template.htmlUrl){
    //       this.chatService.compileUrlHtml(message.template.htmlUrl).subscribe((html)=>{            
    //           this.templateHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    //       });
    //   }
    //   else if(message.template.html){           
    //         this.templateHtml = this.sanitizer.bypassSecurityTrustHtml(message.template.html);
    //   }
  //   // }
  // }
  private mic(){
    if(!this.disableMic){
      if(!this.platform.is("mobileweb")){
        this.chatService.voiceDetector('stop');
      }else{
        this.openMic();
      }
    }
  }


  // event by only microphone
  private openMic() {
    // if(!this.openBackDrop){
    this.zone.run(()=>{
      this.openBackDrop = true;
      this.inputMessage = null;
      this.openPopover = true;
      this.disableMic = false;
    });
    if(!this.popoverContentIsUsed){
      console.log(this.popoverContentIsUsed);
      if (!this.platform.is("mobileweb")) {
        this.speechToTextServ = this.chatService.getSpeechToText().subscribe((res) => {
          console.log(res);
          this.zone.run(() => {
            if (res) {
              this.inputMessage = res;
              if (this.timeOut) {
                clearTimeout(this.timeOut);
              }
              if (res == "ถัดไป" || res == "ปิด" || res == "เปิดเนื้อหา") {
                clearTimeout(this.timeOut);
                this.speechToText.stopListening();
                if (res == "ถัดไป") {
                  this.nextSlide.next(true);
                  setTimeout(() => {
                    this.openMic();
                  }, 500)
                }
                else if (res == "ปิด") {
                  this.chatService.voiceDetector('start');
                  this.resetValue();
                }
                else if (res == "เปิดเนื้อหา") {
                  this.openPopoverContent.next(true);
                }
                // else if(res== "หยุด"){
                //   this.stopYoutube.next(true);
                //   setTimeout(() => {
                //     this.openMic();
                //   }, 500)
                // }
                // else if(res == "เล่น"){
                //   this.playYoutube.next(true);
                //   setTimeout(() => {
                //     this.openMic();
                //   }, 500)
                // }
  
  
              } else {
                this.timeOut = setTimeout(() => {
                  clearTimeout(this.timeOut);
                  this.speechToText.stopListening();
                  this.pushMessageUser();
                  this.dataMakeService.getData(res).then((res) => {
                    this.chatService.mapDataToModelV3(globalVar.chatterTypeBot, res.message, res).then((messageBot) => {
                      this.allMessages.push(messageBot);
                      if (messageBot.items.type == "url" && messageBot.items.formatUrl.id) {
                        this.chatService.getDataVideoFromYoutube(messageBot.items.formatUrl.id).subscribe((res) => {
                          messageBot.items.formatUrl.description = res.items[0].snippet.description;
                          messageBot.items.formatUrl.title = res.items[0].snippet.title;
                          messageBot.items.formatUrl.thumbnailUrl = res.items[0].snippet.thumbnails.high.url;
                        });
                      }
                      if (messageBot.items.type == "url" || messageBot.items.type == "json") {
                        this.currentMessages = messageBot;
                        console.log(this.currentMessages);
  
                        this.openPopover = true;
                      } else if (messageBot.items.type == "html") {
                        this.popoverContentIsUsed = true;
                        this.navCtrl.push(DynamicHtmlPage, {
                          message: messageBot
                        })
                      }
                      this.chatService.getTextToSpeech(messageBot.message).then((res) => {
                        if(messageBot.items.formatUrl.typeMedia != "video"){
                            this.openMic();
                        }
                      });
                    });
                  });
                }, 500);
              }
            }
          });
        }, (err) => {
          console.log(err);
        });
      }
    }
  }

  private send(inputMessage: string) {
    this.disableMic = false;
    this.openBackDrop = true;
    if (inputMessage == "ถัดไป" || inputMessage == "ปิด" || inputMessage == "เปิดเนื้อหา") {
      clearTimeout(this.timeOut);
      if (inputMessage == "ถัดไป") {
        this.nextSlide.next(true);
      }
      else if (inputMessage == "ปิด") {
        this.resetValue();
      }
      else if (inputMessage == "เปิดเนื้อหา") {
        this.openPopoverContent.next(true);
      }
      // else if(inputMessage == "หยุด"){
      //   this.stopYoutube.next(true);
      // }
      // else if(inputMessage == "เล่น"){
      //   this.playYoutube.next(true);
      // }
    } else {
      this.pushMessageUser();
      this.dataMakeService.getData(inputMessage).then((res) => {
        this.chatService.mapDataToModelV3(globalVar.chatterTypeBot, res.message, res).then((messageBot)=>{
          if (messageBot.items.type == "url" && messageBot.items.formatUrl.id) {
            this.chatService.getDataVideoFromYoutube(messageBot.items.formatUrl.id).subscribe((res) => {
              messageBot.items.formatUrl.description = res.items[0].snippet.description;
              messageBot.items.formatUrl.title = res.items[0].snippet.title;
              messageBot.items.formatUrl.thumbnailUrl = res.items[0].snippet.thumbnails.high.url;
            });
          }
          this.allMessages.push(messageBot);
          this.autoScroll();
          if (messageBot.items.type == "url" || messageBot.items.type == "json") {
            this.currentMessages = messageBot;
            console.log(this.currentMessages);
  
            this.openPopover = true;
          } else if (messageBot.items.type == "html") {

            this.navCtrl.push(DynamicHtmlPage, {
              message: messageBot
            })
          }
          if (!this.platform.is("mobileweb")) {
            this.chatService.getTextToSpeech(messageBot.message);
          }
          this.content.resize();
        });

        // this.inputMessage = "ฟินิก";
      })
    }

    // this.inputMessage = "ความเชื่อ";

  }
  private pushMessageUser() {
    if (this.inputMessage) {
      this.chatService.mapDataToModelV3(globalVar.chatterTypeUser, this.inputMessage, null).then((messageUser)=>{
        this.allMessages.push(messageUser);
        this.inputMessage = null;
      });

    }
  }
  resetValue() {
    this.zone.run(()=>{
      this.openPopover = false;
      this.disableScroll = false;
      this.openBackDrop = false;
      this.currentMessages = null;
      this.autoScroll();
    });
  }
  // private openMicx() {
  //   // ui not upadate resolve by zone run
  //   if (this.micState == "michide") {
  //     this.content.resize();
  //     // this.micActive ="mic-active"
  //     this.zone.run(() => {
  //       this.micState = "micshow";
  //       this.inputMessageMic = "กำลังฟัง...";
  //       // this.currentConversationMessages = new Array<ChatModel>();
  //       this.activeMic();
  //     });
  //     // this.content.resize();
  //     // this.autoScroll();
  //     let options = {
  //       language: globalVar.lang.th,
  //       showPopup: false,  // Android only
  //       showPartial: false // iOS only
  //     }
  //     this.speechToText.startListening(options).subscribe((res) => {
  //       if (res[0] != "ถัดไป" && res[0]) {
  //         console.log("comebackform speechtoText", res[0]);
  //         this.micState = "michide";

  //         this.zone.run(() => {
  //           // if(res){
  //           this.inputMessage = res[0];
  //           // if(this.timeOut){
  //           //   clearTimeout(this.timeOut);
  //           // }
  //           // this.timeOut = setTimeout(()=>{
  //           this.loading = true;
  //           // this.inputMessageMic = "";
  //           // clearTimeout(this.timeOut);
  //           this.chatService.getTemplate(res[0]).subscribe((res) => {
  //             // this.nonActiveMic();
  //             this.loading = false;
  //             if (this.inputMessage) {
  //               this.chatService.mapDataToModel(globalVar.chatterTypeUser, this.inputMessage, null, null).then((messageUser) => {
  //                 this.zone.run(() => {
  //                   this.allMessages.push(messageUser);
  //                 });
  //               });
  //             }
  //             this.chatService.mapDataToModelV2(globalVar.chatterTypeBot, null, res).then((messageBot) => {
  //               this.zone.run(() => {
  //                 console.log("mapdataV2", res)
  //                 this.allMessages.push(messageBot);
  //                 // this.currentConversationMessages.push(messageBot);
  //                 this.chatService.getTextToSpeech(messageBot.message).then(() => {
  //                   this.processTemplate(messageBot);
  //                   this.micState = "michide";
  //                   // this.openMic();
  //                 });
  //               });
  //             });

  //           });

  //           // this.chatService.getTemplate()
  //           // this.chatService.getAllChats(this.inputMessage).subscribe((res) => {
  //           //   this.loading = false;
  //           //   this.textListening = '';
  //           //   this.nonActiveMic();
  //           //   //ถ้า messeage ก่อนหน้า มีปุ่ม ให้ diable ปุ่ม
  //           //   this.disableButtonMessageBefore();
  //           //   //push message user
  //           //   this.chatService.mapDataToModel(globalVar.chatterTypeUser, this.inputMessage, null, null)
  //           //     .then((messageUser) => {
  //           //       this.allMessages.push(messageUser);
  //           //     });
  //           //   console.info("Bot Response", res);
  //           //   //message bot
  //           //   this.chatService.mapDataToModel(globalVar.chatterTypeBot, res.msg, null, res).then((messageBot) => {
  //           //     console.log(messageBot);

  //           //     if (messageBot.raw.type == globalVar.typeOfMessage.listOrder) {
  //           //       messageBot.message = messageBot.raw.ed;
  //           //     }
  //           //     if (messageBot.raw.type != globalVar.typeOfMessage.checkOut) {
  //           //       this.chatService.getTextToSpeech(messageBot.message).then((res) => {
  //           //         console.log("res3");
  //           //         if (messageBot.raw.type == globalVar.typeOfMessage.result) {
  //           //           this.dateOfSuccessOrder = new Date();
  //           //         }

  //           //         this.inputMessage = "";
  //           //         this.loading = false;
  //           //         this.allMessages.push(messageBot);
  //           //         this.currentConversationMessages.push(messageBot);
  //           //         // this.openMic();

  //           //       });
  //           //     } else {
  //           //       this.chatService.setInsertItem("22").subscribe((itemList) => {
  //           //         if (itemList.raw.type != globalVar.typeOfMessage.noOrdered) {
  //           //           itemList.raw.items.forEach((item, index) => {
  //           //             this.chatService.addToCart(item.product_id, item.qty).subscribe((res) => {
  //           //               console.log(res);
  //           //               if (index === itemList.raw.items.length - 1) {
  //           //                 this.sendTextToSpeech(messageBot).then((res) => {
  //           //                   this.loading = false;
  //           //                   this.micState = "michide"
  //           //                   this.chatService.voiceDetector('start');

  //           //                   if (!this.platform.is("mobileweb")) {
  //           //                     console.log("goToOpen Uearn");
  //           //                     window.open('uearn://cart-page', '_system');

  //           //                   }
  //           //                   console.log("success to commit", res);
  //           //                 });
  //           //               }
  //           //             }, (err) => {
  //           //               this.chatService.throwException(globalVar.typeOfError.general);
  //           //             });
  //           //           });
  //           //         } else {
  //           //           this.chatService.voiceDetector('start');
  //           //           this.sendTextToSpeech(messageBot);
  //           //         }
  //           //       }, (err) => {
  //           //         this.throwException(globalVar.typeOfError.general);
  //           //       });
  //           //     }
  //           //   });
  //           // }, (err) => {
  //           //   this.throwException(globalVar.typeOfError.networkFail);
  //           // });
  //           // }, 3000);
  //           // }else{
  //           //   this.inputMessageMic = "กำลังประมวล...";
  //           // }
  //         });
  //       } else {
  //         this.slideItem.next(true);
  //         this.loading = false;
  //         this.inputMessage = "";
  //         this.micState = "michide";
  //         setTimeout(() => {
  //           this.content.resize();
  //         }, 100)
  //       }
  //     }, (err) => {
  //       if (this.platform.is("mobileweb")) {
  //         this.throwException(globalVar.typeOfError.micNotSupport);
  //       } else {
  //         this.chatService.voiceDetector('start');
  //         this.throwException(globalVar.typeOfError.micTimeOut);
  //       }

  //     });


  //   }

  // }
  // private closeMic() {
  //   this.micState = 'michide'
  //   this.autoScroll();
  //   this.nonActiveMic();
  // }
  // private activeMic() {
  //   this.micActive = "mic-active";
  //   this.micColor = "mic-color-active";

  // }
  // private nonActiveMic() {
  //   this.micActive = "mic-nonactive";
  //   this.micColor = "mic-color-nonactive";
  // }

  // private sendTextToSpeech(message: ChatModel): Promise<string> {
  //   //before text appear
  //   this.autoScroll();
  //   return new Promise((resolve, reject) => {
  //     if (this.platform.is("mobileweb")) {
  //       //push message bot
  //       this.allMessages.push(message);
  //       this.loading = false;
  //       this.inputMessage = "";
  //       // after text appear
  //       this.autoScroll();
  //       resolve("success to texttospeech");
  //     } else {
  //       this.chatService.getTextToSpeech(message.message).then((res) => {
  //         this.zone.run(() => {
  //           this.loading = false;
  //           this.inputMessage = "";
  //           // after text appear
  //           this.autoScroll();
  //           //push message bot
  //           this.allMessages.push(message);
  //           resolve("success to texttospeech");
  //         });
  //       }).catch((err) => {
  //         this.throwException(globalVar.typeOfError.general);
  //       });
  //     }
  //   });
  // }
  //sender by child component 
  private messageUpdate(event: ChatModel) {
    this.content.resize();
    this.autoScroll();
    this.allMessages.push(event);
  }
  private actionUpdate(event: string) {
    console.log(event);
    let data = JSON.parse(event);
    if (data.action == "openPopover") {
        this.zone.run(()=>{
        console.log("openPopover");
        this.openPopover = true;
        this.disableScroll = true;
        this.hideFooter = true;
        this.currentMessages = data.data;
      });
      
    }
    else if (data.action == "closePopover") {
      this.zone.run(()=>{
        this.speechToText.stopListening();
        this.openPopover = false;
        this.disableScroll = false;
        this.autoScroll();
        this.openBackDrop = false;
        this.currentMessages = null;
        this.hideFooter =false;
        this.popoverContentIsUsed = false;
        this.disableMic = false;
        this.chatService.voiceDetector('start');
      });
    }
    else if(data.action=="eventFormYoutube"){
      this.zone.run(()=>{
        if(data.data==1){
          this.disableMic = true;
          this.openBackDrop = false;
        }else if(data.data==2){
          this.disableMic = false;
          this.mic();
        }
      });
    }
    else if (data.action == "openForm") {
      this.navCtrl.push(DynamicHtmlPage, {
        message: data.data
      });
    }
    else if(data.action=="enterPopoverContent"){
        this.popoverContentIsUsed = true;
    }
    this.content.resize();

    // setTimeout(()=>{
    // let loadScript = this.renderer.createElement(this.elRef.nativeElement,'script');
    // loadScript.text = "document.getElementById('iframe').contentWindow."+"Window.Page1.onClickAJS('1066')";
    // loadScript.type = 'text/javascript';
    // loadScript.async = true;
    // loadScript.charset = 'utf-8';
    // this.elRef.nativeElement.appendChild(loadScript);
    // },5000);
    // .contentWindow.document.getElementsByClassName('addCart');
    // console.log(a);
  }

  private disableButtonMessageBefore() {
    let getTypeMessageBefore = this.allMessages.slice(-1).pop();
    console.log(getTypeMessageBefore);
    // if (getTypeMessageBefore.raw.type == globalVar.typeOfMessage.listOrder) {
    //   this.selectItem.next(true);
    // }
    // else if (getTypeMessageBefore.raw.type == globalVar.typeOfMessage.listOrdered) {
    //   this.cancelOrderedItem.next(true);
    // }
  }
  private autoScroll() {
    setTimeout(function () {
      var itemList = document.getElementById("chat-autoscroll");
      itemList.scrollTop = itemList.scrollHeight;
    }, 10);
  }
  // private throwException(status) {
  //   this.loading = false;
  //   this.inputMessage = "";
  //   this.micState = 'michide';
  //   // this.inputMessageMic = "กรุณากดไมค์อีกครั้ง หรือ พูดคำว่า 'COMPUTER'";
  //   // this.nonActiveMic();
  //   setTimeout(() => {
  //     this.content.resize();
  //   }, 100)
  //   this.chatService.throwException(status);
  // }
  // private closePopup() {
  //   this.openPopup = false;
  //   console.log("close");
  //   this.autoScroll();
  // }
  private checkFocus() {
    this.autoScroll();
  }
  private checkChange(inputMessage){
    if(this.slides.getActiveIndex()==1){
      if(inputMessage){
        this.messageWait = inputMessage;
      }else{
        this.messageWait = "กรุณาพิมพ์..."
      }
    }
  }
  private slideChanged(){
    if(this.openBackDrop){
      this.speechToText.stopListening();
      if(this.slides.getActiveIndex()==0){
        console.log("micForInput");
          setTimeout(()=>{
            this.messageWait = "กำลังฟัง...";
            this.mic();
          },500)
      }
      else if(this.slides.getActiveIndex()==1){
        this.messageWait = "กรุณาพิมพ์...";
        console.log("inputBoxForInput");
      }
    }
  }





}
