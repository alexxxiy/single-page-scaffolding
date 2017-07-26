// Create new Reaact component
class Excel extends React.Component{
	constructor(props){
		super(props);
		this.name = 'Excel';
		this.state = {
			header: this.props.initialHeader,
			data: this.props.initialData,
			fullData: this.props.initialData,
			sortby: null, // column index
			sortOrder: false,
			edit: null, // {row: idx, cell: idx}
			search: false
		};
	}

	render(){
		return <div>
			{this._renderButton()}
			{this._renderTable()}
		</div>

	}

	_renderButton(){
		return(
			<div className="button">
				<button onClick={this._searchToggle.bind(this)}>Search</button>
				<button onClick={this._export.bind(this)}>Export</button>
			</div>
		)
	}

	_renderTable(){
		return (
			<table className="excel">
				{this._renderTableHead()}
				{this._renderTableBody()}
			</table>
		)
	}

	_renderTableHead(){
		return (
			<thead onClick={this._sort.bind(this)}>
				<tr>
					{
						this.state.header.map((title, idx) => {
							if(this.state.sortby === idx){
								return <th key={idx}>{title} {this.state.sortOrder && '\u21D1' || '\u21D3'}</th>;
							}
							return <th key={idx}>{title}</th>;
						})
					}
				</tr>
			</thead>
		)
	}

	_renderTableSearch(){
		if(!this.state.search){
			return null
		}

		return(
			<tr onChange={this._filter.bind(this)}>
				{this.state.header.map((_ignore, idx)=>{
					return (
						<td>
							<input data-cell={idx} type="text"/>
						</td>
					)
				})}
			</tr>
		)
	}

	_renderTableBody(){
		return(
			<tbody onDoubleClick={this._editCell.bind(this)}>
				{this._renderTableSearch()}
				{
					this.state.data.map((row, rowIdx)=>{
						return <tr key={rowIdx}>
							{
								row.map((cell, cellIdx)=>{
									let content = cell;
									let edit = this.state.edit;
									if(edit && edit.row === rowIdx && edit.cell === cellIdx){
										content = <form onSubmit={this._saveCell.bind(this)}>
											<input
												type="text"
												defaultValue={this.state.data[rowIdx][cellIdx]}
												autoFocus={true}
											/>
										</form>
									}
									return <td key={cellIdx} data-row={rowIdx}>{content}</td>;
								})
							}
						</tr>
					})
				}
			</tbody>
		)
	}

	_sort(e){
		let idx = e.target.cellIndex;
		let data = Array.from(this.state.data);
		let sortOrder = this.state.sortby === idx && !this.state.sortOrder;

		data.sort((a,b)=>{
			if(!sortOrder) return a[idx] > b[idx] ? 1 : -1;
			return a[idx] > b[idx] ? -1 : 1;
		});

		this.setState({
			data: data,
			sortby: idx,
			sortOrder: sortOrder
		});
	}

	_editCell(e){
		let [row, cell] = [parseInt(e.target.dataset.row), e.target.cellIndex];

		this.setState({
			edit: {row: row, cell: cell}
		});
	}

	_saveCell(e){
		e.preventDefault();
		let newValue = e.target.firstChild.value;
		let data = Array.from(this.state.data);
		let edit = this.state.edit;
		data[edit.row][edit.cell] = newValue;
		this.setState({
			data: data,
			edit: null
		});
	}

	_searchToggle(){
		this.setState({
			search: !this.state.search,
			data: this.state.fullData
		})
	}

	_filter(e){
		let filteredData = this.state.fullData;
		for(let i = 0; i < this.state.header.length; i++){
			let value = e.currentTarget.childNodes[i].querySelector('input').value;
			filteredData = filteredData.filter((row)=>{
				return row[i].substr(0, value.length) === value;
			});
		}

		this.setState({
			data: filteredData
		});
	}


	_export(e){
		let csv = this.state.data.reduce(function(prev, curr){
			return prev + curr.join(';') + '\n';
		}, '');
		download("file.txt", csv);
	}
};

Excel.propTypes = {
	initialHeader: React.PropTypes.arrayOf(React.PropTypes.string),
	initialData: React.PropTypes.arrayOf(React.PropTypes.any)
};

export default Excel