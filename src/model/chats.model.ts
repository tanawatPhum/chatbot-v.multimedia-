import { templateModel } from './template.model';
export class ChatModel {
    public chatterType: string;
    public message: string;
    public chatterImg: string;
    public positionChatterImg: string;
    public chatterName: string;
    public items = new items();
    // public raw:raw = new raw();
    // public template:templateModel;

}
export class raw {
    public ed: string;
    public st: string;
    public items: items[] = new Array<items>();
    public type: string;

}
export class items {
    type:string;
    formatJson = new formatJsonModel();
    formatHtml = new formatHtmlModel();
    formatUrl = new formatUrlModel();
    // public caption: string;
    // public img: string;
    // public price: number;
    // public seq: number;
    // public totalPrice: number;
    // public qty: number;
    // public product_id: number;
}

export class formatJsonModel {
    public templateName: string;
    public data:productModel[] = new Array<productModel>();
}
export class productModel{

        public name: string;
        public id: string;
        public imageUrl:string;
        public price: string;
        public discount: string;
        public description: string;
        public subDetail = {
            buttonName:null,
            typeProduct: [
                {
                    name: null,
                    imageUrl: null,
                    relative: [
                        {typeMedia:null,url:null}
                    ]
                }
            ]
        }
    
}
export class formatHtmlModel {
    public name:string;
    public imageUrl:string;
    public contents:any[] = new Array<any>();
    public action: any;
}
export class formatUrlModel {
    public typeMedia: string;
    public url:string;
    public id:string;
    public description:string;
    public title:string;
    public thumbnailUrl:string;
}