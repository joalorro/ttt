class WSAdapter {
	static openConnection(){
		return new WebSocket('ws://localhost:3000/cable')
	}

	static liveSocket(webSocket,board){
		webSocket.onmessage = event => {
			let result = JSON.parse(event.data)
			if (result.type !== "ping") console.log(result)
			if (!result.type && !result.message.history){
					let letter = result.message.o_turn == 'true' ? "O" : "X"
					let newBlockInfo = {
						row: result.message.row,
						column: result.message.column,
						letter
					}
					board.addBlockToBoard(newBlockInfo)
			}
		}
	}

	static createBlockDataMsg({row,column,username,OTurn}){
		
		let msg = {
			"command": "message","identifier": "{\"channel\":\"BlocksChannel\"}","data": `{\"action\": \"send_block\",\"row\": \"${row}\",\"column\": \"${column}\",\"username\": \"${username}\",\"o_turn\": \"${OTurn}\"}`
		}
		return msg
	}

	static sendBlockDataMsg(webSocket,msgObj) {
		webSocket.send(JSON.stringify(msgObj))
	}
}

export default WSAdapter
