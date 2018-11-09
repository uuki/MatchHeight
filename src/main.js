import MatchHeight from './MatchHeight'

const matchHeight = new MatchHeight('[data-mh]');


window.addEventListener( 'DOMContentLoaded', function onDomReady() {
  matchHeight.init();
  window.removeEventListener( 'DOMContentLoaded', onDomReady );
} );

window.addEventListener( 'load', function onLoad() {
	matchHeight.update();
	window.removeEventListener( 'load', onLoad );

} );

export default matchHeight;
