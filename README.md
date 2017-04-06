Redux Atomic Action
===================

Installation
============

```bash
npm install --save redux-atomic-action
```

Usage
=====

```javascript
import { createStore, applyMiddleware } from 'redux';
import { createAtomicReducer, atomicThunk } from 'redux-atomic-action';

const initialState = {
	todos: [],
	visibleFilter: "SHOW_ALL"
}

let store = createStore(createAtomicReducer(initialState), applyMiddleware(atomicThunk));


store.subscribe(() => {
	console.log(store.getState().todos);
	// ['something']
})

function addTodo(todo) {
	return (preState) => {
		
		let nextState = Object.assign({}, preState, {
			todos: preState.todos.concat(todo)
		})

		return nextState;
	}
}

store.dispatch(addTodo('something'));
```

Debug
=====

```javascript
function addTodo(todo) {
	let ADD_TODO = pre => Object.assign({}, pre, {
			todos: pre.todos.concat(todo)
		})
	
	return ADD_TODO
}
```

Modify State Tree
=================

```javascript
import { createAtomicReducer, atomicThunk, createStateModifier } from 'redux-atomic-action';

...

let todos = createStateModifier('todos');

function addTodo(todo) {
	let ADD_TODO = todos => todos.concat(todo);

	return todos(ADD_TODO);
}
```

Async Atomic Action
===================

```javascript
function getTodos() {
	return api.get('/api/todos')
		.then(todos => pre => Object.assign({}, pre, { todos }));
}

getTodos.then(store.dispatch);
```