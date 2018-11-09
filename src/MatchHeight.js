import throttle from './throttle.js'
import ViewBase from './view_base'
const errorThreshold = 1; // in px

export default class MatchHeight extends ViewBase {

	constructor ( selector ) {
		super(selector)

		this.initialized = false;
		this.remains;
		this.resizeHandler;
	}

	init () {
		super.init()
		if( ! this.resizeHandler ) this.resizeHandler = throttle( this.update.bind(this), 200 ).bind(this);

		this.update()
		this.bind()

		this.initialized = true;
	}

	bind () {
    window.addEventListener( 'resize', this.resizeHandler );
	}

	unbind () {
    window.removeEventListener( 'resize', this.resizeHandler );
	}

	update () {
		if ( this.elements.length === 0 || ! this.initialized ) return;

		this.remains = Array.prototype.map.call( this.elements, ( el ) => {
			el.style.minHeight = '';
			return { el: el };
		} );

		this.process();
	}

	clear () {
		if ( ! this.initialized ) return;
		this.unbind();

		Array.prototype.map.call( this.elements, ( el ) => {
			el.style.minHeight = '';
		} );

		this.initialized = false;
	}

	isInitialized () {
		return this.initialized;
	}

	process () {
		this.remains.forEach( ( item ) => {
			const bb = item.el.getBoundingClientRect();
			item.top    = bb.top;
			item.height = bb.height;
		} );

		this.remains.sort( ( a, b ) => a.top - b.top );

		const processingTop = this.remains[ 0 ].top;
		const processingTargets = this.remains.filter( item => Math.abs( item.top - processingTop ) <= errorThreshold );
		const maxHeightInRow = Math.max( ...processingTargets.map( ( item ) => item.height ) );

		processingTargets.forEach( ( item ) => {

			const error = processingTop - item.top + errorThreshold;
			const paddingAndBorder =
				parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'padding-top' ),         10 ) +
				parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'padding-bottom' ),      10 ) +
				parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'border-top-width' ),    10 ) +
				parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'border-bottom-width' ), 10 );
			item.el.style.minHeight = `${ maxHeightInRow - paddingAndBorder + error }px`;

		} );

		this.remains.splice( 0, processingTargets.length );
		if ( 0 < this.remains.length ) this.process();
	}
}