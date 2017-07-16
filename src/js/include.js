exports.test = function(){
	console.log('Hello from include.js');
	ReactDOM.render(
		React.DOM.h1(null, 'Hello from React!!!'),
		document.getElementById('app')
	);
};