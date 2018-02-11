import { Component, Input, OnChanges, ViewChild, OnInit, Output, EventEmitter, OnDestroy, trigger, state, style, animate, transition, NgZone, Renderer, ElementRef, ChangeDetectorRef, HostListener, ViewContainerRef, AfterViewInit } from '@angular/core';
import { Content,IonicPage, NavController, NavParams,AlertController,Slides } from 'ionic-angular';
import { PopoverContentPage } from './popover-content/popover-content';
import { ChatModel } from '../../model/chats.model';
import { Observable, Subject } from 'rxjs';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import * as YouTubePlayer from 'youtube-player';
import { ChatService } from '../../service/chat.service';
declare var YouTubePlayer: any;
/**
 * Generated class for the PopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
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
export class PopoverPage implements OnInit,OnChanges,AfterViewInit{
  @Output('actionEmitter')
  private actionEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Input('message') message: ChatModel;
  private typeData:string;
  private templateName:string;
  private player:any;
  @ViewChild(Content) content: Content;
  @ViewChild('Slides') slides: Slides;

  @Input('openBackDrop') openBackDrop:boolean;
  @Input('nextSlide') nextSlide: Subject<boolean> = new Subject();
  @Input('openPopoverContent') openPopoverContent: Subject<boolean> = new Subject();
  @Input('stopYoutube') stopYoutube: Subject<boolean> = new Subject();
  @Input('playYoutube') playYoutube: Subject<boolean> = new Subject();
  @Input('messageWait') messageWait;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private chatService:ChatService,
    private speechToText: SpeechRecognition,
 
  ) {

    // const alert = this.alertCtrl.create({
    //   title: 'Low battery',
    //   subTitle: '10% of battery remaining',
    //   buttons: ['Dismiss']
    // });
    // alert.present();
  }
  ngOnInit(){
    
    // console.log(this.message);
    // this.typeData = this.message.items.type;
    // this.templateName  = this.message.items.formatJson.templateName;
    // console.log(this.typeData);
    this.nextSlide.subscribe((res)=>{
      if(this.message){
        // if(this.slides.isEnd()){
        //   this.slides.initialSlide;
        // }else{
          if(this.slides.isEnd()){
            this.slides.slideTo(0);
            console.log("end");
          }else{
            this.slides.slideNext();
          }
      
        // } 

      }
    });
    this.openPopoverContent.subscribe((res)=>{
        if(this.typeData=='json'){
          this.navCtrl.push(PopoverContentPage,{
            product:this.message.items.formatJson.data[this.slides.getActiveIndex()]
          });
        }
    });
    // this.playYoutube.subscribe((res)=>{
    //   if(this.typeData=="url"){

    //     this.player.playVideo();
    //   }
    // });
    // this.stopYoutube.subscribe((res)=>{
    //   if(this.typeData=="url"){
    //     this.player.stopVideo();
    //   }
    // });
    

  }


  ngOnChanges() {
    if(this.message){
      this.typeData = this.message.items.type;
      this.templateName  = this.message.items.formatJson.templateName;
      if(this.typeData=="url"){
        setTimeout(()=>{
          this.player = YouTubePlayer('youtubeBox');
          this.player.loadVideoById(this.message.items.formatUrl.id);
          this.player.playVideo();
          this.player.on('stateChange', (event) => {
            let data = JSON.stringify({action:"eventFormYoutube",data:event.data});
            this.actionEmitter.emit(data);
              console.log(event);
          });
        },500);
      }
    }

    // changes.prop contains the old and the new value...
  }
  ngAfterViewInit(){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }
  closePopover(){
      let data = JSON.stringify({action:"closePopover",data:null});
      this.actionEmitter.emit(data);
      // this.speechToText.stopListening();
      // this.chatService.voiceDetector('start');
  } 
  openContent(product){
    console.log(product);
    let data = JSON.stringify({action:"enterPopoverContent",data:null});
    this.speechToText.stopListening();
    this.actionEmitter.emit(data);
    this.navCtrl.push(PopoverContentPage,{
      product:product
    });
  }
  // slideChanged(){
  //   if(this.slides.isEnd()){
  //     this.slides.initialSlide;
  //   }
  // }
  slideChanged(){
    let lengthSlide = this.slides.length()-1;
    console.log(this.slides.length());
    if(lengthSlide==this.slides.getPreviousIndex()){
      this.slides.slideTo(0);
      console.log("end");
    }
    // console.log(this.slides.getPreviousIndex());
  }

}
