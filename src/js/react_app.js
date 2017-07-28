'use strict';
import Excel from './Excel';
import Suggest from './Suggest';

let app = ()=>{
	let header = ['one', 'two', 'free', 'four', 'five'];
	let data = [
		['one1', 'two1', 'free1', 'four1', 'five1'],
		['one2', 'two2', 'free2', 'four2', 'five2'],
		['one3', 'two3', 'free3', 'four3', 'five3'],
		['one4', 'two4', 'free4', 'four4', 'five4'],
		['one5', 'two5', 'free5', 'four5', 'five5'],
		['one6', 'two6', 'free6', 'four6', 'five6'],
		['one7', 'two7', 'free7', 'four7', 'five7'],
		['one8', 'two8', 'free8', 'four8', 'five8']
	];

	let props = {
		initialHeader: header,
		initialData: data
	};

	ReactDOM.render(
		<div id="discovery">
			<h2>Excel Component</h2>
			<Excel {...props}/>

			<h2>Suggest Component</h2>
			<Suggest />
		</div>
		,document.getElementById('app')
	);

	// Show our awesome React component
	// ReactDOM.render(
	// 	React.createElement(TextAreaCounter, {}),
	// 	document.getElementById('app')
	// );
};


// Mixin
let logMixin = {
	_log: function (methodName, args) {
		console.log(this.name + '::' + methodName, args);
	},
	componentWillUpdate: function () {
		this._log('componentWillUpdate', arguments)
	},
	componentDidUpdate: function () {
		this._log('componentDidUpdate', arguments)
	},
	componentWillMount: function () {
		this._log('componentWillMount', arguments)
	},
	componentDidMount: function () {
		this._log('componentDidMount', arguments)
	},
	componentWillUnmount: function () {
		this._log('componentWillUnmount', arguments)
	}
};

// Test React component
let Counter = React.createClass({
	name: 'Counter',
	displayName: 'Counter',
	mixins: [logMixin],
	propTypes: {
		count: React.PropTypes.number.isRequired
	},
	render: ()=>{
		console.log(this.name + '::' + 'render()');
		return React.DOM.span(null, this.props.count);
	},
	// if return false - don't update component
	shouldComponentUpdate: (nextProps, nextState)=>{
		console.log(this.name + '::' + 'shouldComponentUpdate()', nextProps, nextState);
		return nextProps.count !== this.props.count;
	}
});

// Another test React component
let TextAreaCounter = React.createClass({
	name: 'TextAreaCounter',
	mixins: [logMixin],
	// Define property (optional)
	propTypes: {
		text: React.PropTypes.string /* .isRequired */
	},
	// Default values for not required properties
	getDefaultProps: function(){
		return {
			text: ''
		}
	},
	getInitialState: function(){
		return {
			text: this.props.text
		}
	},
	render: function(){
		console.log(this.name + '::' + 'render()');
		let counter = null;
		if(this.state.text.length > 0){
			counter = React.DOM.h3(null,
				React.createElement(Counter,
					{count: this.state.text.length}
				)
			)
		}
		return React.DOM.div(
			{id: 'myDiv', style: {display: 'inline-block'}},
			React.DOM.textarea({
				defaultValue: this.state.text,
				onChange: this._textChange
			}),
			counter
		)
	},
	// custom methods begin with "_"
	_textChange: function(ev){
		console.log(ev.target.value);
		this.setState({
			text: ev.target.value
		})
	}
});

export default app