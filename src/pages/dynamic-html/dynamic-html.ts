import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatModel } from '../../model/chats.model';
import { Chats } from '../chats/chats';
import { ChatService } from '../../service/chat.service';

/**
 * Generated class for the DynamicHtmlPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-dynamic-html',
  templateUrl: 'dynamic-html.html',
})
export class DynamicHtmlPage implements OnInit{
  private message:ChatModel;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private chatService: ChatService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DynamicHtmlPage');
  }
  ngOnInit() {
    // this.chatService.sendUpdateEventAction();
    this.message = this.navParams.get("message");
  }
  back(){
    this.navCtrl.pop();
  }
  submit(){
    this.navCtrl.pop();
    this.chatService.sendDataToServlet(document.forms,this.message.items.formatHtml.action);
    console.log(document.forms);
    // this.navCtrl.push(Chats,{
    //   forms:document.forms
    // })
    // console.log(document.forms[1].test.value);
  }
}
