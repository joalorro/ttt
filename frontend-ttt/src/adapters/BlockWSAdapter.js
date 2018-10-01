import WSAdapter from './WSAdapter'

class BlockWSAdapter extends WSAdapter {

	static liveSocket(webSocket, board) {
		webSocket.onmessage = event => {
			let result = JSON.parse(event.data)
			if (result.type !== "ping") console.log(result)
			if (!result.type && !result.message.history) {
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

	static createBlockDataMsg({row,column,user_id,OTurn}) {
		let msg = {
			"command": "message",
			"identifier": "{\"channel\":\"BlocksChannel\"}",
			"data": `{\"action\": \"send_block\",
			\"row\": \"${row}\",
			\"column\": \"${column}\",
			\"user_id\": \"${user_id}\",
			\"o_turn\": \"${OTurn}\"}`
		}
		return msg
	}

}

export default BlockWSAdapter