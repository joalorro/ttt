import React, { Component } from 'react';
import '../stylesheets/Board.css'

class Block extends Component {
	
	state = {
		clicked: false,
		letter: ""
	}

	handleClick = () => {
		let letter = this.props.OTurn ? "O" : "X"
		if (!this.state.clicked) this.props.renderTurn(letter, this["_reactInternalFiber"].key)
		this.setState({clicked: true, letter})
	}

	shouldComponentUpdate() {
		return (!this.state.clicked)
	}

	renderXorO = () => {
		return this.state.letter ? this.state.letter : null
	}

	handleReceived = () => {
		if (this.props.letter){
			this.setState({
				clicked: true,
				letter: this.props.letter
			})
		}
	}

	render() {
		return (
			<div className="block" onClick=
				{this.handleClick}>
				{this.handleReceived()}
				{this.renderXorO()}
			</div>
		);
	}
}

export default Block;
