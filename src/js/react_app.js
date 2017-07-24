module.exports = function(){

	// Show our awesome React component
	var header = ['one', 'two', 'free', 'four', 'five'];
	ReactDOM.render(
		React.createElement(Excel, {header: header}),
		document.getElementById('app')
	);

	// Show our awesome React component
	// ReactDOM.render(
	// 	React.createElement(TextAreaCounter, {}),
	// 	document.getElementById('app')
	// );
};

// Create new Reaact component
var Excel = React.createClass({
	name: 'Excel',
	propTypes: {
		header: React.PropTypes.arrayOf(React.PropTypes.string)
	},
	render: function(){
		return (
			<table className="excel">
				<thead>
					<tr>
						{
							this.props.header.map((title, idx) => {
								return <th key={idx}>{title}</th>;
							})
						}
					</tr>
				</thead>
				<tbody>
					<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				</tbody>
			</table>
		)
	}
});

// Mixin
var logMixin = {
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

// Create new Reaact component
var Counter = React.createClass({
	name: 'Counter',
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

// Create new Reaact component
var TextAreaCounter = React.createClass({
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
		var counter = null;
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
