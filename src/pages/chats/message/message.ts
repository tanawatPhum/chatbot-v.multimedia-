import { Component, ViewChild, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy,AfterViewInit,Renderer,ElementRef,ChangeDetectorRef,ViewContainerRef,NgZone,HostListener,trigger, state, style,animate, transition } from '@angular/core';
import { NavController, Content, Platform,Slides } from 'ionic-angular';
import { AnimationService, AnimationBuilder } from 'css-animator';
import { ChatModel, items, raw } from '../../../model/chats.model';
import { ChatService } from '../../../service/chat.service';
import { globalVar } from '../../../global/globalVar';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { FaceRecognitionSevice } from '../../../service/faceRecognition.service';
import { Observable,Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'message',
    templateUrl: 'message.html',
    styleUrls: ['/message.scss'],
    animations: [
        trigger('fadeInUp', [
          transition(':enter', [
            style({
              opacity: 0,
              transform: 'translate3d(0,100px,0)'
    
            }),
            animate('0.4s ease-in', style({
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
export class MessageComponent implements OnInit, OnChanges{
    @Output('messageEmitter')
    private messageEmitter: EventEmitter<ChatModel> = new EventEmitter<ChatModel>();

    @Output('actionEmitter')
    private actionEmitter: EventEmitter<string> = new EventEmitter<string>();
    @Input('message') message: ChatModel;
    @Input('typeOfChat') typeOfChat:string;
    @ViewChild('Slides') slides: Slides;
    @Input('slideItem') slideItem:Subject<boolean>;
    // @Input('cancelOrderedItem') cancelOrderedItemEvent:Subject<boolean>;
    // @Input('selectItem') selectItemEvent:Subject<boolean>;

    private numberItem = 1;
    private loading: boolean = false;
    private dateOfSuccessOrder: Date;
    private selectItem: boolean = false;
    private confirmItem: boolean = false;
    private cancelOrderedItem: boolean = false;
    private requestBotMessageUrl: string = globalVar.requestBotMessageUrl;
    private typeOfMessageListOrder = globalVar.typeOfMessage.listOrder;
    private typeOfMessageFirst = globalVar.typeOfMessage.first;
    private animator: AnimationBuilder;
    private checkValueIsChange:boolean = false;
    private loadHtml:any;
    private loadCss:any;
    private loadScript:any;
    private scrollContent:any;

    private templateUrl:any;
    private templateJson:any;
    private templateHtml:any;

    private video:any;


    constructor(
        private navCtrl: NavController,
        private animationService: AnimationService,
        private chatService: ChatService,
        private platform: Platform,
        private faceRecognitionSevice: FaceRecognitionSevice,
        private renderer:Renderer,
        private sanitizer: DomSanitizer,
        private elRef:ElementRef, 
        private cdRef:ChangeDetectorRef,
        private zone: NgZone
    ) {
        this.animator = animationService.builder();
        this.dateOfSuccessOrder = new Date();

    }
    ngOnInit() {
        console.log(this.message);
  
        if(this.message.hasOwnProperty('template')){
            // if(this.message.template.json&&this.message.template.json.length>0){
            //     this.templateJson = this.message.template.json;
            //     // console.log(this.templateJson);
            // }else if(this.message.template.htmlUrl){
            //     this.chatService.compileUrlHtml(this.message.template.htmlUrl).subscribe((html)=>{            
            //         this.templateHtml = this.sanitizer.bypassSecurityTrustHtml(html);
            //     });
            // }
            // else if(this.message.template.html){           
            //       this.templateHtml = this.sanitizer.bypassSecurityTrustHtml(this.message.template.html);
            // }
          }
        //   this.slideItem.subscribe(()=>{
        //       if(this.slides){
        //         if(this.slides.isEnd()){
        //             this.slides.loop = true;
        //             this.slides.slideTo(0,100);
        //         }else{
        //             this.slides.slideNext(100,true);
        //         }

        //       }
        //   })

        // console.log(this.typeOfChat);
        // this.typeOfChat.subscribe((type)=>{
        //     if(type=='mic'){
        //         this.scrollContent = "100%";
        //     }else{
        //         this.scrollContent = "40vh";
        //     }

        // });
   
    
                   // this.templateEmitter.emit(true);
 
            // setTimeout(()=>{
                // let loadScript = this.renderer.createElement(this.elRef.nativeElement,'script');
                // loadScript.text = "document.getElementById('iframe').contentWindow."+"Window.Page1.onClickAJS('Hello World')";
                // loadScript.type = 'text/javascript';
                // loadScript.async = true;
                // loadScript.charset = 'utf-8';
                // this.elRef.nativeElement.appendChild(loadScript);
                // document.getElementById('iframe').contentWindow.Window.Page1.onClickAJS("Hello World")
                // document.getElementById('iframe').contentWindow.document.getElementById('addCartx').onclick();
                // console.log(document.getElementById('iframe').contentWindow.Window);
                // console.log(document.getElementById('iframe').contentWindow.Window.Page1.onClickAJS("Hello World"));
                // document.getElementById('iframe').contentWindow.document.getElementById('addCartx').onclick();
            //     setInterval(()=>{
            //         $('#iframe').contents().find('#addCartx')[0].click();
            //     },100)
            //     console.log($('#iframe').contents().find('#addCartx'));
                // document.getElementById('iframe').contentWindow.document.getElementById('addCartx').click();
              
                // $(a).onclick();               
                // console.log(a);
                // console.log(document.getElementById('addCart'));
                // let iframe  = this.iframe.nativeElement.contentDocument;
                // let addToCart  =iframe.getElementById("addCartx");
                // addToCart.click();
                // console.log(addToCart);
                
                // $('#addCart').click();
                // console.log($('#addCart'));
                // addToCart.click();
                // this.eventFire(iframe.getElementById("addCart"),'click');
                // console.log(iframe.getElementById("addCart"));
                // console.log(iframe);
      

                //     var event = new MouseEvent('click', {
                //         'view': window,
                //         'bubbles': true,
                //         'cancelable': true
                //       });
                //       var cb = iframe.getElementById("addCart"); 
                //       cb.dispatchEvent(event);
     
                // console.log(iframe.getElementById("addCart"));
                // this.eventFire(iframe.getElementById("addCart"),'click');
                // console.log(iframe.addCart());
            // },500)

            // setTimeout(()=>{
            //     console.log(document.getElementById('iframe'));
            // },500)

        // this.compileTemplate(this.message);
 

        //event ต้องเท่ากับ true
        // this.selectItemEvent.subscribe(event => {
        //     if(this.message.raw.type==globalVar.typeOfMessage.listOrder&&event){
        //         this.selectItem = event;
        //     }
        // });
        // this.cancelOrderedItemEvent.subscribe(event => {
        //     if(this.message.raw.type==globalVar.typeOfMessage.listOrdered&&event){
        //         this.cancelOrderedItem = event;
        //     }
        // });
    }

    ngAfterViewInit() {
    
    }
 
    ngOnChanges() {}
    // private compileTemplate(messsage:ChatModel){
    //     console.log(messsage.template.url);

    //    let objTemplate = messsage.template;
    //    if(objTemplate){
    //     console.log(objTemplate);
    //     if(objTemplate.hasOwnProperty('html')&&objTemplate.html){
    //       this.chatService.compileUrlHtml(objTemplate.html).subscribe((html)=>{            
    //           this.loadHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    //       });
    //     }
    //     if(objTemplate.hasOwnProperty('script')&&objTemplate.script.length>0){
    //       objTemplate.script.forEach(element => {
    //         console.log(element);
    //         let loadScript = this.renderer.createElement(this.elRef.nativeElement,'script');
    //         loadScript.src = element;
    //         loadScript.type = 'text/javascript';
    //         loadScript.async = true;
    //         loadScript.charset = 'utf-8';
    //         this.elRef.nativeElement.appendChild(loadScript);
    //         setTimeout(()=>{
    //             let element1 = document.getElementById("addCart");
    //             console.log(element1);
    //         },2000)
    //       });
    //     }
    //     if(objTemplate.hasOwnProperty('css')&&objTemplate.css.length>0){
    //       objTemplate.css.forEach(element => {
    //         let loadCss  = this.renderer.createElement(this.elRef.nativeElement,'link');
    //         loadCss.rel  = 'stylesheet';
    //         loadCss.type = 'text/css';
    //         loadCss.href = element.href;
    //         loadCss.media = 'all';
    //         this.elRef.nativeElement.appendChild(loadCss);
    //       });
    //     }
    //   }

    // }
    //only click event 
    private sendSelectItem(item: items, seq: number) {
        this.loading = true;
        this.selectItem = true;
        this.chatService.mapDataToModel(globalVar.chatterTypeBot, "คุณต้องการยืนยันสิ่งที่เลือกหรือไม่", globalVar.typeOfMessage.confirm, null)
            .then((messageBot) => {
                // messageBot.raw.items[0] = item;
                // messageBot.raw.items[0].seq =seq+1;
                this.sendTextToSpeech(messageBot);
            });
    }
    private sendConfrimItem(messageUser: ChatModel) { //only event click
        this.loading = true;
        this.confirmItem = true;
        console.log(messageUser);
        // this.faceRecognitionSevice.faceUser = "tanawat.phum";
        // this.chatService.setInsertItem(this.faceRecognitionSevice.faceUser).subscribe((res)=>{
        //     console.log(res);
        // })
        // this.chatService.getCalPriceItem(messageUser.raw.items[0].seq,this.numberItem).subscribe((res)=>{
        //     console.log(res);
        // })
        // this.chatService.setInsertItem(this.faceRecognitionSevice.idUser)
        // let reg = /(\d\.|\d\d\.|\d\d\d\.|\d\d\d\d\.|\d\d\d\d\d\.)/
        // let item = messageUser.raw.items[0].caption.replace(reg, '') + ' ' + messageUser.raw.items[0].qty + 'ชิ้น';
        // this.chatService.getCalPriceItem(messageUser.raw.items[0].seq, messageUser.raw.items[0].qty).subscribe((res) => {
        //     this.chatService.mapDataToModel(globalVar.chatterTypeBot, res.msg, globalVar.typeOfMessage.result, res)
        //         .then((messageBot) => {
        //             this.sendTextToSpeech(messageBot);
        //         });
        // },(err)=>{
        //     this.chatService.throwException(globalVar.typeOfError.networkFail);
        // })

        // messageBot.raw.items[0] = messageUser.raw.items[0];
        // console.log(messageUser.raw.items);
        // messageBot.raw.items[0].price = messageUser.raw.items[0].price * this.numberItem;
    }
    private sendCancleItem() {
        this.loading = true;
        this.confirmItem = true;
        this.chatService.mapDataToModel(globalVar.chatterTypeBot, "คุณได้ทำการยกเลิกรายการ", null, null).then((messageBot) => {
            this.sendTextToSpeech(messageBot);
        });
    }
    private sendCancleOrderedItem(item: items) {
        // this.cancelOrderedItem = true;
        // this.chatService.getCancelOrderedItem(item.product_id).subscribe((res) => {
        //     this.chatService.mapDataToModel(globalVar.chatterTypeBot, res.msg, globalVar.typeOfMessage.result, res)
        //     .then((messageBot) => {
        //         this.sendTextToSpeech(messageBot);
        //     });
        // },(err)=>{
        //     this.chatService.throwException(globalVar.typeOfError.networkFail);
        // });
    }
    private sendTextToSpeech(message: ChatModel) {
        if (this.platform.is("mobileweb")) {
            //push message bot
            this.messageEmitter.emit(message);
            this.loading = false;
        }else{
            this.chatService.getTextToSpeech(message.message).then((res) => {
                this.messageEmitter.emit(message);
                this.loading = false;
            }).catch((err)=>{
                this.chatService.throwException(globalVar.typeOfError.networkFail);
            });
        }
    }
    private incrementItem(item: items) {
        // this.numberItem++;
        // item.qty = this.numberItem;
        // item.totalPrice = item.price * this.numberItem;
    }

    private decrementItem(item: items) {
        // if (this.numberItem > 1) {
        //     this.numberItem--;
        //     item.qty = this.numberItem;
        //     item.totalPrice = item.price * this.numberItem;
        // }
    }
    //sender by parent component when seleted item
    private selectItemUpdate(event: boolean) {
        this.selectItem = false;
    }
    private processFuction(){

    }
    private openPopover(message){
        
        let data = JSON.stringify({action:"openPopover",data:message});
        this.actionEmitter.emit(data);
        console.log(message);
    }
    private openForm(message){
        let data = JSON.stringify({action:"openForm",data:message});
        this.actionEmitter.emit(data);
    }

}
