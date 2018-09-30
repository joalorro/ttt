import React, { Component } from 'react';
import Board from './Board'

class UsernameRoom extends Component {
	
	state = {
		username: '',
		submitted: false
	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.setUsername(this.state.username)
		this.setState({
			submitted: true
		})
	}

	renderBoard = () => <Board username={this.state.username} />
	
	handleChange = (username) => {
		this.setState({username})
	}

	render() {
		return (
			<div>
				{!this.state.submitted ? (
					<form onSubmit={this.handleSubmit}>
						<label>Enter a name: </label>
						<input type="text" onChange={e => this.handleChange(e.target.value)} />
						<input type="submit" />
					</form>
				) : (
					this.renderBoard()
				)}
			</div>
		);
	}
}

export default UsernameRoom;
