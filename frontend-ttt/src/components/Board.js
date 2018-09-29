import React, { Component } from 'react';
import { ActionCable } from 'react-actioncable-provider'
import { API_ROOT, HEADERS } from '../constants'
import Cable from './Cable'
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
		game_id: 0
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
		WSAdapter.liveSocket(blockWebSocket)
	}

	updateBoardOnClick = (letter,blockNum) => {
		let row = Math.floor(blockNum / 3.1) 
		let column = (blockNum - 1) % 3
		this.setState(prevState => {
			const board = prevState.board
			board[row][column] = letter
			return {board}
		}, () => {
			// console.log(this.state.board)
		})
		this.createAndSendData({row,column})
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
		for (let i = 0 ; i < 9; i++) {
			let block = <Block key={`${i + 1}`} renderTurn={this.renderTurn} OTurn={this.state.OTurn} />
			blocks.push(block)
		}
		return blocks
	}

	//Functions related to WS's

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
