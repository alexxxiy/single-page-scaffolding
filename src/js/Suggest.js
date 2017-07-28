const {Component, PropTypes} = React;

class Suggest extends Component{
	constructor(props){
		super(props);
		this.state = {};
	}

	render(){
		let randomId = Math.random().toString(16).substring(2);
		return(
			<div>
				<input list={randomId}/>
				<datalist id={randomId}>
					<options value="1"></options>
					<options value="11"></options>
					<options value="3333"></options>
					<options value="22"></options>
					<options value="5555"></options>
					<options value="6"></options>
					<options value="7"></options>
				</datalist>
			</div>
		)
	}
}

export default Suggest