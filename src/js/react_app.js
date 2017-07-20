module.exports = function(){
	// Create new Reaact component
	var TextAreaCounter = React.createClass({
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
			return React.DOM.div(
				{id: 'myDiv', style: {display: 'inline-block'}},
				React.DOM.textarea({
					defaultValue: this.state.text,
					onChange: this._textChange
				}),
				React.DOM.h3(null, this.state.text.length)
			)
		},
		// custom methods begin with "_"
		_textChange: function(ev){
			console.log(ev.target.value);
			this.setState({
				text: ev.target.value
			})
		}
	})


	// Show our awesome React component
	ReactDOM.render(
		React.createElement(TextAreaCounter, {}),
		document.getElementById('app')
	)
}