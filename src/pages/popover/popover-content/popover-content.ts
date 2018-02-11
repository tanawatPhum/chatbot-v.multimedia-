import { Component,OnInit,Output,EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { productModel } from '../../../model/chats.model';
import { DataMakeService } from '../../../service/dataMake.service';
import { Chats } from '../../chats/chats';
import { ChatService } from '../../../service/chat.service';

/**
 * Generated class for the PopoverContentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-popover-content',
  templateUrl: 'popover-content.html',
})
export class PopoverContentPage implements OnInit {
  private product:productModel;
  private relativeProduct:any[] = new Array<any>();
  private selectedProduct:any;
  @Output('actionEmitter')
  private actionEmitter: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public dataMakeService: DataMakeService,
    private chatService: ChatService,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverContentPage');
  }
  back(){
    this.navCtrl.pop();
  }
  ngOnInit(){
    this.product = this.navParams.get("product");
    this.relativeProduct = this.product.subDetail.typeProduct[0].relative;
    this.selectedProduct = this.product.subDetail.typeProduct[0];
  }
  selectProduct(relativeProduct){
    this.relativeProduct = relativeProduct;
  }
  submit(){
    this.navCtrl.pop();
    this.chatService.sendDataToServlet(this.product,this.product.subDetail.buttonName);
    // this.navCtrl.push(Chats,{
    //   inputMessage:this.product.subDetail.buttonName
    // })
    // this.navCtrl.pop();
    // let data = JSON.stringify({action:"nextContent",data:this.product});
    // this.actionEmitter.emit(data);
    // this.dataMakeService.getData(this.product.subDetail.buttonName).then((res) => {

    // });
    // this.product
  }

}
