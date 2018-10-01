import React, { Component } from 'react';
import { ActionCable } from 'react-actioncable-provider'
// import { API_ROOT, HEADERS } from '../constants'
// import Cable from './Cable'
import BlockWSAdapter from '../adapters/BlockWSAdapter'
import UserWSAdapter from '../adapters/UserWSAdapter'


import '../stylesheets/Board.css'
import Block from './Block'

let blockWebSocket
let userWebSocket

class Board extends Component {

	state = {
		board: [
			["","",""],
			["","",""],
			["","",""]
		],
		OTurn: false,
		game_id: 0,
		team1: [],
		team2: [],
		observers: [],
		currentPlayer: {
			username: this.props.username,
			id: 0,
			nought: true
		}

	}

	componentDidMount = () => {
		userWebSocket = UserWSAdapter.openConnection()
		userWebSocket.onopen = () => {
			const subscribeUser = {
				"command": "subscribe",
				"identifier": "{\"channel\":\"UsersChannel\"}"
			}
			userWebSocket.send(JSON.stringify(subscribeUser))
			UserWSAdapter.liveSocket(userWebSocket, this)

			let userMsg = UserWSAdapter.createUserDataMsg(this.props.username)
			userWebSocket.send(JSON.stringify(userMsg))

		}
		
	
		blockWebSocket = BlockWSAdapter.openConnection()
		blockWebSocket.onopen = () => {
			const subscribeBlocks = {
				"command": "subscribe",
				"identifier": "{\"channel\":\"BlocksChannel\"}"
			}
			blockWebSocket.send(JSON.stringify(subscribeBlocks))
		}
		BlockWSAdapter.liveSocket(blockWebSocket,this)
	}

	updateBoardOnClick = (letter,blockNum) => {
		let row = Math.floor(blockNum / 3.1) 
		let column = (blockNum - 1) % 3
		let blockInfo = {
			row,
			column,
			letter
		}
		this.addBlockToBoard(blockInfo)
		this.createAndSendData({row,column})
	}

	addBlockToBoard = ({row,column,letter}) => {
		this.setState(prevState => {
			let board = prevState.board
			board[row][column] = letter
			return {
				board,
				OTurn: !prevState.OTurn
			}
		}, () => console.log(this.state))
	}

	addUser = user => {
		if (!this.state.team1.length) {
			this.setState(prevState => {
				return {team1: prevState.team1.concat(user)}
			}, () => console.log(this.state))
		} else if (!this.state.team2.length){
			this.setState(prevState => {
				return {team2: prevState.team2.concat(user)}
			}, () => console.log(this.state))
		} else {
			this.setState(prevState => {
				return {observers: prevState.observers.concat(user)}
			}, () => console.log(this.state))
		}
	}

	createAndSendData = ({row,column}) => {
		const msg = BlockWSAdapter.createBlockDataMsg({
			row,
			column,
			user_id: this.state.currentPlayer.id,
			OTurn: this.state.OTurn
		})
		// debugger
		blockWebSocket.send(JSON.stringify(msg))
	}

	renderTurn = (letter,blockNum) => {
		this.updateBoardOnClick(letter,blockNum)
		this.setState(prevState => {
			return {
				OTurn: !prevState.OTurn
			}
		})
	}

	renderBlocks = () => {
		const blocks = []
		let board = this.state.board

		for (let i = 0 ; i < 9; i++) {
			
			let row = Math.floor(i / 3.1)
			let column = (i - 1) % 3
			let letter = board[row][column]

			let block = <Block key={`${i}`} renderTurn={this.renderTurn} OTurn={this.state.OTurn} letter={letter} />
			blocks.push(block)
		}
		return blocks
	}

	handleReceivedBlock = response => {
		const { block } = response 
		console.log(response)
		console.log(block)
	}

	showState = () =>{
		console.log(this.state)
	}

	render() {
		return (
			<div id="gameboard">
				<ActionCable 
					channel={{ channel: 'GamesChannel' }}
					onReceived={ this.hanleReceivedBlock }
				/>
					{this.renderBlocks()}
					{console.log(this.state)}
					<button onClick={this.showState}>Show State </button>
			</div>
		);
	}
}

export default Board;
