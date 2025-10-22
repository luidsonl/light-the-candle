export default class ObjectAbstraction{
    constructor(elementRef, callbacks){
        this.elementRef = elementRef;
        this.callbacks = callbacks
    }

    getEl(){
        return this.elementRef.current;
    }

    getStyle(){
        const el = this.getEl();
        return el.style;
    }

    getRect(){
        const el = this.getEl();
        return el.getBoundingClientRect();
    }

    getLeft(){
        return parseInt(this.getStyle().left, 10);
    }

    getTop(){
        return parseInt(this.getStyle().top, 10);
    }

    getHeight(){
        return this.getRect().height;
    }

    getWidth(){
        return this.getRect().width;
    }

    getType(){
        return this.getEl().dataset.objectType;
    }
}