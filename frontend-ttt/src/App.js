import React, { Component } from 'react';
import './App.css';
import UsernameRoom from './components/UsernameRoom'

class App extends Component {

	state = {
		username: ''
	}

	setUsername = (username) => {
		this.setState({username})
	}

	render() {
		return (
		<div className="App">
			<UsernameRoom setUsername={this.setUsername} />
		</div>
		);
	}
}

export default App;
