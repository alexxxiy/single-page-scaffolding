module.exports = function(){

	// Show our awesome React component
	var header = ['one', 'two', 'free', 'four', 'five'];
	var data = [
		['one1', 'two1', 'free1', 'four1', 'five1'],
		['one2', 'two2', 'free2', 'four2', 'five2'],
		['one3', 'two3', 'free3', 'four3', 'five3'],
		['one4', 'two4', 'free4', 'four4', 'five4'],
		['one5', 'two5', 'free5', 'four5', 'five5'],
		['one6', 'two6', 'free6', 'four6', 'five6'],
		['one7', 'two7', 'free7', 'four7', 'five7'],
		['one8', 'two8', 'free8', 'four8', 'five8']
	];

	ReactDOM.render(
		React.createElement(Excel, {initialHeader: header, initialData: data}),
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
		initialHeader: React.PropTypes.arrayOf(React.PropTypes.string),
		initialData: React.PropTypes.arrayOf(React.PropTypes.any)
	},
	getInitialState: function(){
		return {
			header: this.props.initialHeader,
			data: this.props.initialData,
			sortby: null, // column index
			sortOrder: false,
			edit: null // {row: idx, cell: idx}
		}
	},
	render: function(){
		return (
			<table className="excel">
				<thead>
					<tr>
						{
							this.state.header.map((title, idx) => {
								if(this.state.sortby === idx){
									return <th key={idx} onClick={this._sort}>{title} {this.state.sortOrder && '\u21D1' || '\u21D3'}</th>;
								}

								return <th key={idx} onClick={this._sort}>{title}</th>;
							})
						}
					</tr>
				</thead>
				<tbody>
					{
						this.state.data.map((row, rowIdx)=>{
							console.log(this.state);
							return <tr key={rowIdx}>
								{
									row.map((cell, cellIdx)=>{
										let content = cell;
										let edit = this.state.edit;

										if(edit && edit.row === rowIdx && edit.cell === cellIdx){
											content = <input type="text"/>
											console.log(content);
										}

										return <td key={cellIdx} data-row={rowIdx} onDoubleClick={this._editCell}>{content}</td>;
									})
								}
							</tr>
						})
					}
				</tbody>
			</table>
		)
	},
	_sort: function(e){
		var idx = e.target.cellIndex;
		var data = Array.from(this.state.data);
		var sortOrder = this.state.sortby === idx && !this.state.sortOrder;
		// console.log(sortOrder);
		data.sort((a,b)=>{
			if(!sortOrder) return a[idx] > b[idx] ? 1 : -1;
			return a[idx] > b[idx] ? -1 : 1;
		});

		this.setState({
			data: data,
			sortby: idx,
			sortOrder: sortOrder
		});
	},
	_editCell: function(e){
		let [row, cell] = [parseInt(e.target.dataset.row), e.target.cellIndex];
		// console.log('editCell', row, cell);
		this.setState({
			edit: {row: row, cell: cell}
		});	
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
