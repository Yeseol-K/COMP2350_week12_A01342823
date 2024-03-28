
function getAllTodos(callback) {
	let data = [
		  { todo_id: 1, todo_name: 'buy milk' },
		  { todo_id: 2, todo_name: 'and cheese' },
		  { todo_id: 3, todo_name: 'truck in for service' },
		  { todo_id: 4, todo_name: 'get a hair cut' },
		  { todo_id: 5, todo_name: 'do your homework!' }
		]
	;
	callback(null, data);
}


module.exports = {getAllTodos}
