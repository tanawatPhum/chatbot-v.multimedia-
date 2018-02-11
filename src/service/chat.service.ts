import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ToastController,Platform } from 'ionic-angular'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';
import { ChatModel, items, formatJsonModel, productModel } from '../model/chats.model';
import { Http,RequestOptions, Headers,URLSearchParams} from '@angular/http';
import { globalVar } from '../global/globalVar';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { FaceRecognitionSevice } from './faceRecognition.service';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { templateModel } from '../model/template.model';
declare var cordova:any;
declare var window:any;
@Injectable()
export class ChatService {
    private subject = new Subject<any>();
    private timeOut:number = 5000;

    constructor(
        private http: Http,
        private speechToText:SpeechRecognition,
        private textToSpeech:TextToSpeech,
        private toastCtrl: ToastController,
        private platform: Platform,
        private faceRecognitionSevice:FaceRecognitionSevice,
        private androidPermissions: AndroidPermissions
    ) {}
    login():Observable<any>{
        const body = {
            clientId:"abc",
            password:"l;ylfu0hkcvf,bo",
            username:"dmpsystem"
        }
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(globalVar.requestAuthen+"/eaf-rest/login",body,options).timeout(this.timeOut).map(response => response.json())
    }
    addToCart(productItemId:number,qty:number):Observable<any>{
        const body = {
            businessUserId:"1066",
            itemPrice:null,
            itemQuantity:qty||1,
            productItemId:productItemId,
            vipCode:null,
        }
        let headers = new Headers(
            {   'Content-Type': 'application/json',
                'authorization':this.faceRecognitionSevice.idToken,
                'clientId':"abc"
            }
        );
        let options = new RequestOptions({
             headers: headers
        });
        return this.http.post(globalVar.requestEAF+"/eaf-rest/DMPManualServlet?key=addcart",body,options).map(response => {
            if(response.text().length==0){
                throw ("error");
            }else{
                return response;
            }
        }).retry();
    }
    getAllChats(message:string):Observable<any>{
        const params = new URLSearchParams();
        params.set('msg', message);
        let options = new RequestOptions({'withCredentials': true});
        return this.http.post(globalVar.requestBotMessageUrl+"/message",params,options).timeout(this.timeOut).map(response => response.json());
    }
    mapResToModel(res):ChatModel{
        let chatModel = new ChatModel();
        chatModel.chatterType = globalVar.chatterTypeBot;
        chatModel.chatterName = globalVar.chatterNameBot;
        chatModel.message = res.msg;
        chatModel.chatterImg = globalVar.chatterImgBot;
        chatModel.positionChatterImg = globalVar.positionChatterImgLeft;
        return chatModel;
    }
    mapDataToModel(chatterType:string,messageInput:string,typeOfMessage:string,data:ChatModel):Promise<ChatModel>{
        return new Promise((resolve,reject)=>{
            let message = new ChatModel();
            message.chatterType = chatterType;
            message.message = messageInput;
            if(chatterType=="bot"){
                message.chatterName = globalVar.chatterNameBot;
                message.chatterImg = globalVar.chatterImgBot;
                message.positionChatterImg = globalVar.positionChatterImgLeft;
                // if(data){
                //     Object.assign(message.raw,data.raw);
                // }
                // if(typeOfMessage){
                //     message.raw.type = typeOfMessage;
                // }
            }else if(chatterType=="user"){
                message.chatterType = globalVar.chatterTypeUser;
                message.chatterName = this.faceRecognitionSevice.nameUser||globalVar.chatterNameUser;
                message.chatterImg =  this.faceRecognitionSevice.faceUser||globalVar.chatterImgUser;
                message.positionChatterImg = globalVar.positionChatterImgRight;
            }
            resolve(message);
        });    
    }
    mapDataToModelV3(chatterType:string,messageInput:string,data:any):Promise<ChatModel>{
        return new Promise((resolve,reject)=>{
            let message = new ChatModel();
            message.chatterType = chatterType;
            message.message = messageInput;
            if(chatterType=="bot"){
                message.chatterName = globalVar.chatterNameBot;
                message.chatterImg = globalVar.chatterImgBot;
                message.positionChatterImg = globalVar.positionChatterImgLeft;
                if(data){
                    message.items.type = data.type;
                    if(data.type=="json"){
                        message.items.formatJson.templateName = data.templateName;
                        data.data.forEach(element => {
                            console.log(element);
                            message.items.formatJson.data.push(Object.assign(new productModel(),element)) 
                        });
                    }else if(data.type=="url"){
                        message.items.formatUrl.url =data.url;
                        message.items.formatUrl.typeMedia = data.typeMedia;
                        message.items.formatUrl.id = data.id;
                    }
                    else if(data.type=="html"){
                        message.items.formatHtml.name = data.name;
                        message.items.formatHtml.imageUrl = data.image || "assets/img/placeholder.png";
                        message.items.formatHtml.action =  data.action;
                        message.items.formatHtml.contents = data.contents;
                    }
                }
            }else if(chatterType=="user"){
                message.chatterType = globalVar.chatterTypeUser;
                message.chatterName = this.faceRecognitionSevice.nameUser||globalVar.chatterNameUser;
                message.chatterImg =  this.faceRecognitionSevice.faceUser||globalVar.chatterImgUser;
                message.positionChatterImg = globalVar.positionChatterImgRight;
            }
            resolve(message);
        });
    }
    mapDataToModelV2(chatterType:string,typeOfMessage:string,template:templateModel):Promise<ChatModel>{
        return new Promise((resolve,reject)=>{
            let message = new ChatModel();
            message.chatterType = chatterType;
            message.message = template.message;
            if(chatterType=="bot"){
                message.chatterName = globalVar.chatterNameBot;
                message.chatterImg = globalVar.chatterImgBot;
                message.positionChatterImg = globalVar.positionChatterImgLeft;
                // message.template = template;

            }else if(chatterType=="user"){
                message.chatterType = globalVar.chatterTypeUser;
                message.chatterName = this.faceRecognitionSevice.nameUser||globalVar.chatterNameUser;
                message.chatterImg =  this.faceRecognitionSevice.faceUser||globalVar.chatterImgUser;
                message.positionChatterImg = globalVar.positionChatterImgRight;
            }
            resolve(message);
        });    
    }
    processUrl(url:string):Observable<any>{
        let options = new RequestOptions({'withCredentials': true});
        return this.http.get(url,options);
    }
    // getDetailItem(index:number):Observable<ChatModel>{
    //     const params = new URLSearchParams();
    //     params.set('msg', index.toString());
    //     let headers = new Headers(
    //         {   'Content-Type': 'application/json',
    //             'withCredentials': true
    //         }
    //     );
    //     let options = new RequestOptions({
    //          headers: headers
    //     });
    //     return this.http.post(globalVar.requestBotMessageUrl+"/message",params,options).map(response => response.json())  
    // }
    getCalPriceItem(idItem:number,qty:number):Observable<any>{
        //seq ลำดับ item 
        //qty จำนวน item
        let options = new RequestOptions({'withCredentials': true});
        return this.http.get(globalVar.requestBotMessageUrl+"/order/"+idItem+"/"+(qty||1),options).timeout(this.timeOut).map(response => response.json())  
    }
    getCancelOrderedItem(idItem:number):Observable<any>{
        let options = new RequestOptions({'withCredentials': true});
        return this.http.delete(globalVar.requestBotMessageUrl+"/order/"+idItem,options).timeout(this.timeOut).map(response => response.json());
    }
    getTemplate(message:string):Observable<templateModel>{
        let options = new RequestOptions({'withCredentials': true});
        const params = new URLSearchParams();
        params.set('msg', message);
        
        return this.http.post("http://192.168.43.250:8080/fakeAi/getTemplate",params,options).timeout(this.timeOut).map(response => response.json())    
    }
    compileUrlHtml(url:string):Observable<string>{
        return  this.http.get(url)
        .map(response => response.text());
    }
    // setCheckOutItem():Observable<string>{
    //     let options = new RequestOptions({'withCredentials': true});
    //     return this.http.get(globalVar.requestBotMessageUrl+"/order/check",options).timeout(this.timeOut).map(response => response.json())  
    // }
    setInsertItem(idUser:string):Observable<any>{
        //seq ลำดับ item 
        //qty จำนวน item
        let options = new RequestOptions({'withCredentials': true});
        return this.http.get(globalVar.requestBotMessageUrl+"/order/"+idUser+"/commit",options).timeout(this.timeOut).map(response => {console.log(response); return response.text() ? response.json() : {}; ;});  
    }
    // service voice
    getSpeechToText():Observable<any>{
        let options = {
            language:globalVar.lang.th,
            showPopup:false,  // Android only
            showPartial:false // iOS only
        }
        // return this.speechToText.startListening(options).flatMap((matches: Array<string>)=>{                     
        //     return Observable.from(matches);
        // }).catch((err)=>{
        //     // this.getSpeechToText();
        //     return Observable.throw(err);
        // })
            return Observable.fromPromise(this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO))
            .flatMap(()=>{
                return Observable.fromPromise(this.speechToText.isRecognitionAvailable())
                .flatMap(()=>{
                    let options = {
                        language:globalVar.lang.th,
                        showPopup:false,  // Android only
                        showPartial:false // iOS only
                    }
                    return this.speechToText.startListening(options).flatMap((matches: Array<string>)=>{                      
                        return Observable.from(matches);
                    }).catch((err)=>{
                        console.log(err);
                        this.getSpeechToText();
                        return Observable.throw(err);
                    })   
                }).catch((err)=>{
                    return Observable.throw(err);
                });
            });
    }
  
    getTextToSpeech(message:string):Promise<any>{
        return new Promise((resovle,reject)=>{
            this.textToSpeech.speak({
                text: message,
                locale: globalVar.lang.th,
                rate: 1
                // gender:"male"
            }).then((res)=>{
                resovle(res);
            })
            .catch((err)=>{
                reject(err);
            })
        })    
    }
    sendDataToServlet(data:any,action:string){
        this.subject.next(action);
    }
    sendUpdateEventAction(){
        this.subject.next("enter to child component");
    }
    upadateEventAction(): Observable<any> {
        return this.subject.asObservable();
    }
    // voice Detector
    voiceDetector(state:string){
        if (!this.platform.is("mobileweb")) {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then((res)=>{
                    cordova.plugins.vad.startDectection(state,(ev) => this.success(ev), (ev) => this.error(ev));
            });
        }
    }
    // call back from plugin
    success(ev){
        console.log(ev);
        this.subject.next(ev);
        return ev;
    }
    error(ev){
        console.log(ev);
        // cordova.plugins.vad.startDectection('start',(ev) => this.success(ev), (ev) => this.error(ev));
    }
    callbackVoiceSuccess(success){

    }
    callbackVoiceError(err){

    }
    // update event to any component when plugin has callback
    upadateEvenFromVoiceDetector(): Observable<any> {
        console.log("updateEvent");
        return this.subject.asObservable();
    }
    // getDataAllChats():Observable<ChatModel>{
    //         if(this.seqOrder==0){
    //             this.seqOrder++;
    //             let chatModel = new ChatModel();
    //             chatModel.chatterType = globalVar.chatterTypeBot;
    //             chatModel.chatterName = globalVar.chatterNameBot;
    //             chatModel.message = "รายการที่คุณเลือกมีดังต่อไปนี้";
    //             chatModel.chatterImg = globalVar.chatterImgBot;
    //             chatModel.positionChatterImg = globalVar.positionChatterImgLeft;
    //             chatModel.raw.ed = "ระบุหมายเลขเพื่อสั่งรายการ";
    //             chatModel.raw.type = globalVar.typeOfMessage.listOrder;
    //             let item = new items();
    //             item.caption = "แฮมเบอร์เกอร์";
    //             item.img = "hamburger.jpg";
    //             item.price = 20;
    //             globalVar.requestBotMessageUrl ="assets/img/";
    //             chatModel.raw.items.push(item);
    //             // this.subject.next(chatModel);
    //             return Observable.of(chatModel);
    //         }else{
    //             this.seqOrder = 0;
    //             let chatModel = new ChatModel();
    //             chatModel.chatterType = globalVar.chatterTypeBot;
    //             chatModel.chatterName = globalVar.chatterNameBot;
    //             chatModel.message = "คำสั่งซื้อแฮมเบอร์เกอร์ เสร็จสมบูรณ์ครับ";
    //             chatModel.chatterImg = globalVar.chatterImgBot;
    //             chatModel.positionChatterImg = globalVar.positionChatterImgLeft;
    //             chatModel.raw.type = globalVar.typeOfMessage.result;
    //             return Observable.of(chatModel);
    //         }
        
    // }
    throwException(status:string){
        let time = 1000;
        if(status==globalVar.typeOfError.networkFail){
            time = 2000;
        }
        this.toastCtrl.create({
            message: status,
            duration: time,
            position: 'bottom'
        }).present();
    }
    clearSubject(){
        this.subject = new Subject<any>();
    }
    getDataVideoFromYoutube(id:string):Observable<any>{
        return this.http.get("https://www.googleapis.com/youtube/v3/videos?id="+id+"&key=AIzaSyCnTGMAgS2bu07CVkyxQSKgbI0dRkStZzA&part=snippet,contentDetails,statistics,status").map(response => 
        response.json());
    }

    
}