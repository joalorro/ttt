class WSAdapter {
	static openConnection(){
		return new WebSocket('ws://localhost:3000/cable')
	}
}

export default WSAdapter
