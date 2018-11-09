export default class {
  constructor ( selector ) {
    this.selector = selector;
    this.elements = document.querySelectorAll( this.selector );

    if(this.elements.length) {
      this.init();
    }
  }

  init () {
  }
}