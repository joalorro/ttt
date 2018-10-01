import WSAdapter from './WSAdapter'

class UserWSAdapter extends WSAdapter{

	static liveSocket(websocket,board) {
		websocket.onmessage = event => {
			let result = JSON.parse(event.data)
			let user 
			if (result.type !== "ping") console.log(result)
			if (!result.type && !result.message.history){
				user = {...result.message}
				board.addUser(user)

				if (board.state.currentPlayer.username === user.username && board.state.currentPlayer.id === 0){
					board.setState(prevState => {
						return {
							...prevState,
							currentPlayer: user 
						}
					})
				}

			}
		}
	}

	static createUserDataMsg(username){
		return {
			"command": "message",
			"identifier": "{\"channel\":\"UsersChannel\"}",
			"data": `{\"action\": \"send_user\",\"username\": \"${username}\"}`
		}
	}

}

export default UserWSAdapter