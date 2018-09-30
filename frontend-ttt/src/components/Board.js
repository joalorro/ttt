import React, { Component } from 'react';
import { ActionCable } from 'react-actioncable-provider'
// import { API_ROOT, HEADERS } from '../constants'
// import Cable from './Cable'
import WSAdapter from '../functions/WSAdapter'


import '../stylesheets/Board.css'
import Block from './Block'

let blockWebSocket

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
		team2: []
	}

	componentDidMount = () => {
	
		blockWebSocket = WSAdapter.openConnection()
		blockWebSocket.onopen = e => {
			const subscribeBlocks = {
				"command": "subscribe",
				"identifier": "{\"channel\":\"BlocksChannel\"}"
			}
			blockWebSocket.send(JSON.stringify(subscribeBlocks))
		}
		WSAdapter.liveSocket(blockWebSocket,this)
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

	createAndSendData = ({row,column}) => {
		const msg = WSAdapter.createBlockDataMsg({
			row,
			column,
			username: this.props.username,
			OTurn: this.state.OTurn
		})
		// debugger
		WSAdapter.sendBlockDataMsg(blockWebSocket, msg)
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

	render() {
		return (
			<div id="gameboard">
				<ActionCable 
					channel={{ channel: 'GamesChannel' }}
					onReceived={ this.hanleReceivedBlock }
				/>
					{this.renderBlocks()}
			
			</div>
		);
	}
}

export default Board;
