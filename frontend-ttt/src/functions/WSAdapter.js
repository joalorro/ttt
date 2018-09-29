class WSAdapter {
	static openConnection(){
		return new WebSocket('ws://localhost:3000/cable')
	}

	static liveSocket(webSocket){
		webSocket.onmessage = event => {
			let result = JSON.parse(event.data)
			console.log(result)
		}
	}

	static createBlockDataMsg({row,column,username,OTurn}){
		
		const msg = {
			"command": "message","identifier": "{\"channel\":\"BlocksChannel\"}","data": `{\"action\": \"send_block\",\"row\": \"${row}\",\"column\": \"${column}\",\"username\": \"${username}\",\"o_turn\": \"${OTurn}\"}`
		}

		console.log(msg)

		return msg
	}

	static sendBlockDataMsg(webSocket,msgObj) {
		console.log(msgObj)
		webSocket.send(JSON.stringify(msgObj))
	}
}

export default WSAdapter
