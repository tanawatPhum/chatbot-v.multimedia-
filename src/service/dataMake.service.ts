import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ToastController } from 'ionic-angular'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';
import { ChatModel, items } from '../model/chats.model';
import { Http,RequestOptions, Headers,URLSearchParams} from '@angular/http';
import { globalVar } from '../global/globalVar';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
declare var cordova:any;

@Injectable()
export class DataMakeService {
    private seqOrder:number=0;
    private subject = new Subject<any>();
    private mockup:any ={};
    constructor(
        private http: Http,
        private speechToText:SpeechRecognition,
        private textToSpeech:TextToSpeech,
        private toastCtrl: ToastController
    ) {

    }
    getData2(message:string):Observable<any>{
        return Observable.fromPromise(this.getData(message));
    }
    getData(message:string):Promise<any>{
        return new Promise((resolve,reject)=>{
            console.log(message);
            if(/ขอรูปตัวอย่าง/.test(message)){
                this.mockup.message = "ขอรูปตัวอย่าง";
                this.mockup.type="json"
                this.mockup.templateName ="product"
                this.mockup.data=[
                    {
                    name:"รูปตัวอย่าง1",
                    id:34,
                    imageUrl:"assets/img/pic1.png",
                    price:"",
                    discount:0,
                    description:" ในปัจจุบันที่การธุรกิจออนไลน์กำลังขยายตัว ทำให้เว็บไซต์อีคอมเมิร์ซ ร้านค้าออนไลน์ และโซเชียลเน็ตเวิร์กต่างมีจำนวนผู้ขายเพิ่มขึ้นอย่างมาก"+
                    "การที่มีผู้ขายในตลาดเพิ่มมากขึ้นนั้นดีต่อผู้ซื้อเพราะผู้ซื้อสามารถเปรียบเทียบและเลือกซื้อสินค้าจากผู้ขายที่มีคุณภาพได้ตามต้องการ"+
                    "แต่การตัดสินใจเลือกซื้อสินค้าในร้านใดร้านหนึ่งย่อมต้องมีเงื่อนไขประกอบการเลือกซื้อมากขึ้น ในมุมของผู้ขายสินค้าอาจจะต้องคิดหนัก"+
                    "เพราะหากในตลาดออนไลน์มีร้านค้าที่ขายสินค้าชนิดเดียวกับคุณอยู่หลายร้าน คุณจะทำอย่างไรให้ลูกค้าเลือกซื้อของกับคุณ ในยุคนี้การเปรียบเทียบด้านราคาอาจไม่ใช่สิ่งสำคัญในการตัดสินใจเสมอซื้อไป"+
                    "แล้วอะไรล่ะที่จะช่วยทำให้ร้านค้าของคุณแตกต่างจากคู่แข่ง และดึงดูดให้ลูกค้าตัดสินใจซื้อสินค้าจากคุณมากกว่าคู่แข่ง Weloveshopping"+
                    "ขอแนะนำวิธีที่ช่วยสร้างความน่าสนใจให้สินค้าของคุณ ช่วยเพิ่มแรงจูงใจในการซื้อ และสร้างความเป็นมืออาชีพให้กับคุณด้วยการเขียนรายละเอียดสินค้าที่มีคุณภาพ",
                    subDetail:{
                        buttonName:"รายละเอียดเพิ่มเติม",
                        typeProduct:[
                            {
                                name:"",
                                imageUrl:"assets/img/2.jpg",
                                relative:[
                                    {typeMedia:"image",url:"assets/img/avalant.jpg"}
                                ]
                            }
                        ]
                    }
        
                
                },
                {
                    name:"รูปตัวอย่าง2",
                    id:34,
                    imageUrl:"assets/img/pic2.jpg",
                    price:"",
                    discount:0,
                    description:" ในปัจจุบันที่การธุรกิจออนไลน์กำลังขยายตัว ทำให้เว็บไซต์อีคอมเมิร์ซ ร้านค้าออนไลน์ และโซเชียลเน็ตเวิร์กต่างมีจำนวนผู้ขายเพิ่มขึ้นอย่างมาก"+
                    "การที่มีผู้ขายในตลาดเพิ่มมากขึ้นนั้นดีต่อผู้ซื้อเพราะผู้ซื้อสามารถเปรียบเทียบและเลือกซื้อสินค้าจากผู้ขายที่มีคุณภาพได้ตามต้องการ"+
                    "แต่การตัดสินใจเลือกซื้อสินค้าในร้านใดร้านหนึ่งย่อมต้องมีเงื่อนไขประกอบการเลือกซื้อมากขึ้น ในมุมของผู้ขายสินค้าอาจจะต้องคิดหนัก"+
                    "เพราะหากในตลาดออนไลน์มีร้านค้าที่ขายสินค้าชนิดเดียวกับคุณอยู่หลายร้าน คุณจะทำอย่างไรให้ลูกค้าเลือกซื้อของกับคุณ ในยุคนี้การเปรียบเทียบด้านราคาอาจไม่ใช่สิ่งสำคัญในการตัดสินใจเสมอซื้อไป"+
                    "แล้วอะไรล่ะที่จะช่วยทำให้ร้านค้าของคุณแตกต่างจากคู่แข่ง และดึงดูดให้ลูกค้าตัดสินใจซื้อสินค้าจากคุณมากกว่าคู่แข่ง Weloveshopping"+
                    "ขอแนะนำวิธีที่ช่วยสร้างความน่าสนใจให้สินค้าของคุณ ช่วยเพิ่มแรงจูงใจในการซื้อ และสร้างความเป็นมืออาชีพให้กับคุณด้วยการเขียนรายละเอียดสินค้าที่มีคุณภาพ",
                    subDetail:{
                        buttonName:"รายละเอียดเพิ่มเติม",
                        typeProduct:[
                            {
                                name:"",
                                imageUrl:"assets/img/hamburger.jpg",
                                relative:[
                                    {typeMedia:"image",url:"assets/img/hamburger.jpg"}
                                ]
                            }
                        ]
                    }
        
                
                }
            ]
        }
        else if(/ขอเนื้อหาตัวอย่าง/.test(message)){
            this.mockup.message = "เนื้อหาตัวอย่าง";
            this.mockup.type="json"
            this.mockup.templateName ="product"
            this.mockup.data=[
                {
                name:"เนื้อหาตัวอย่าง",
                id:34,
                imageUrl:"assets/img/avalant.jpg",
                price:"-",
                discount:0,
                description:" ในปัจจุบันที่การธุรกิจออนไลน์กำลังขยายตัว ทำให้เว็บไซต์อีคอมเมิร์ซ ร้านค้าออนไลน์ และโซเชียลเน็ตเวิร์กต่างมีจำนวนผู้ขายเพิ่มขึ้นอย่างมาก"+
                "การที่มีผู้ขายในตลาดเพิ่มมากขึ้นนั้นดีต่อผู้ซื้อเพราะผู้ซื้อสามารถเปรียบเทียบและเลือกซื้อสินค้าจากผู้ขายที่มีคุณภาพได้ตามต้องการ"+
                "แต่การตัดสินใจเลือกซื้อสินค้าในร้านใดร้านหนึ่งย่อมต้องมีเงื่อนไขประกอบการเลือกซื้อมากขึ้น ในมุมของผู้ขายสินค้าอาจจะต้องคิดหนัก"+
                "เพราะหากในตลาดออนไลน์มีร้านค้าที่ขายสินค้าชนิดเดียวกับคุณอยู่หลายร้าน คุณจะทำอย่างไรให้ลูกค้าเลือกซื้อของกับคุณ ในยุคนี้การเปรียบเทียบด้านราคาอาจไม่ใช่สิ่งสำคัญในการตัดสินใจเสมอซื้อไป"+
                "แล้วอะไรล่ะที่จะช่วยทำให้ร้านค้าของคุณแตกต่างจากคู่แข่ง และดึงดูดให้ลูกค้าตัดสินใจซื้อสินค้าจากคุณมากกว่าคู่แข่ง Weloveshopping"+
                "ขอแนะนำวิธีที่ช่วยสร้างความน่าสนใจให้สินค้าของคุณ ช่วยเพิ่มแรงจูงใจในการซื้อ และสร้างความเป็นมืออาชีพให้กับคุณด้วยการเขียนรายละเอียดสินค้าที่มีคุณภาพ",
                subDetail:{
                    buttonName:"รายละเอียดเพิ่มเติม",
                    typeProduct:[
                        {
                            name:"",
                            imageUrl:"assets/img/avalant.jpg",
                            relative:[
                                {typeMedia:"image",url:"assets/img/avalant.jpg"}
                            ]
                        }
                    ]
                }
    
            
            }
        ]
    }
    else if(/ขอวีดีโอตัวอย่าง/.test(message)||/ขอวิดีโอตัวอย่าง/.test(message)){
        this.mockup.type="url";
        this.mockup.message = "วีดีโอตัวอย่าง";
        this.mockup.typeMedia = "video"
        this.mockup.id = "sRCOJLtcox0";
        this.mockup.url = "";
    }
    else if(/ขอเอกสารตัวอย่าง/.test(message)){
        this.mockup.name="เอกสารตัวอย่าง";
        this.mockup.message = "เอกสารตัวอย่าง";
        this.mockup.imageUrl=null;
        this.mockup.type="html";
        this.mockup.contents = [
            '<form id="myForm1" class="w3-container">'+
            '<h2 class="w3-text-blue">Input Form</h2>'+
            '<p>Use any of the w3-text-color classes to color your labels.</p>'+
            '<p>' +    
            '<label class="w3-text-blue"><b>First Name</b></label>'+
            '<input class="w3-input w3-border" name="first" type="text"></p>'+
            '<p>'+     
            '<label class="w3-text-blue"><b>Last Name</b></label>'+
            '<input class="w3-input w3-border" name="last" type="text"></p>'+
            '<p>'+      
          '</form>',
            '<form id="myForm2" class="w3-container">'+
            '<h2 class="w3-text-blue">Input Form</h2>'+
            '<p>Use any of the w3-text-color classes to color your labels.</p>'+
            '<p>'+ 
            '<label class="w3-text-blue"><b>Education</b></label>'+
            '<input class="w3-input w3-border" name="first" type="text"></p>'+
            '<label class="w3-text-blue"><b>Option</b></label>'+
            '<select class="w3-select w3-border" name="option" id="test">'+
            '<option value="" disabled selected>Choose your option</option>'+
            '<option value="1">Option 1</option>'+
            '<option value="2">Option 2</option>'+
            '<option value="3">Option 3</option>'+
            '</select>' +
            '</form>'
        ]
        this.mockup.action = 'ตกลง';
    }
    else if(/ตกลง/.test(message)){
        this.mockup.name="คำสั่ง";
        this.mockup.message = "เสร็จสมบูรณ์";
        this.mockup.imageUrl=null;
        this.mockup.type="html";
        this.mockup.contents = [
            '<div style="width:100%;text-align:center"><h1>เสร็จสมบูรณ์</h1></div>'
        ]
        this.mockup.action = '';
    }
    else if(/รายละเอียดเพิ่มเติม/.test(message)){
        this.mockup.name="คำสั่ง";
        this.mockup.message = "รายละเอียดเพิ่มเติม";
        this.mockup.imageUrl=null;
        this.mockup.type="html";
        this.mockup.contents = [
            '<div style="width:100%;text-align:center"><h1>รายละเอียดเพิ่มเติม</h1></div>'
        ]
        this.mockup.action = '';
    }
    else{
        this.mockup.message = "ขออภัยฉันไม่เข้าใจสิ่งที่คุณพูด";
        this.mockup.type="error";
    }
    console.log(this.mockup);
    // if(this.mockup){
        resolve(this.mockup);
    // }else{
    //     reject("ไม่ตรง");
    // }
        })

       
    }

    getAllChats():Observable<ChatModel>{
            if(this.seqOrder==0){
                this.seqOrder++;
                let chatModel = new ChatModel();
                chatModel.chatterType = globalVar.chatterTypeBot;
                chatModel.chatterName = globalVar.chatterNameBot;
                chatModel.message = "รายการที่คุณเลือกมีดังต่อไปนี้";
                chatModel.chatterImg = globalVar.chatterImgBot;
                chatModel.positionChatterImg = globalVar.positionChatterImgLeft;
                // chatModel.raw.ed = "กรุณาเลือกรายการ";
                // chatModel.raw.type = globalVar.typeOfMessage.listOrder;
                // let item = new items();
                // item.caption = "แฮมเบอร์เกอร์";
                // item.img = "assets/img/hamburger.jpg";
                // item.price = 20;
                // chatModel.raw.items.push(item);
                this.subject.next(chatModel);
                return this.subject.asObservable();
            }    
    }

}