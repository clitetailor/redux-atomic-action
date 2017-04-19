Redux Atomic Action
===================

> Inspired by Haskell and Angular 2

[![Build Status](https://travis-ci.org/clitetailor/redux-atomic-action.svg?branch=master)](https://travis-ci.org/clitetailor/redux-atomic-action)

Core Concept
------------

```javascript
function createAction() {
	// ...
	return atomicAction;
}
```

Install
-------

```bash
npm install --save redux-atomic-action
```

Usage
-----

```javascript
import { createStore, applyMiddleware } from 'redux';
import { createAtomicReducer, atomicThunk } from 'redux-atomic-action';

const initialState = {
	todos: [],
	visibleFilter: "SHOW_ALL"
}

let store = createStore(createAtomicReducer(initialState),
	applyMiddleware(atomicThunk));

store.subscribe(() => {
	console.log(store.getState().todos);
	// => ['something']
})

function addTodo(todo) {
	return (prevState) => {
		
		let nextState = Object.assign({}, prevState, {
			todos: prevState.todos.concat(todo)
		})

		return nextState;
	}
}

store.dispatch(addTodo('something'));
```

Modify State Tree
-----------------

```javascript
import { createAtomicReducer, atomicThunk, createStateModifier } from 'redux-atomic-action';

// ...

let todos = createStateModifier('todos');

function addTodo(todo) {
	let ADD_TODO = _todos => _todos.concat([todo]);

	return todos(ADD_TODO);
}

store.dispatch(addTodo('something'))
```

```javascript
let initialState = {
	dashboard: {
		todos: [...]
	}
}

let todos = createStateModifier(['dashboard', 'todos'])
```

Action Name
-----------

```javascript
function addTodo(todo) {
	let ADD_TODO = prev => Object.assign({}, prev, {
			todos: prev.todos.concat(todo)
		})
	
	return ADD_TODO;
}
// action.name === "ADD_TODO"
```

### createStateModifier

```javascript
let todos = createStateModifier('todos');

function addTodo(todo) {
	let ADD_TODO = _todos => _todos.concat([todo]);
	
	return todos(ADD_TODO);
}
// action.name === "ADD_TODO"
```

### name

```javascript
import { name } from 'redux-atomic-action'; // *alias*: `nameFunc`

function addTodo(todo) {
	return name(state =>
		state.update('todos',
			todos => todos.concat([todo])), "ADD_TODO");
}
// action.name === "ADD_TODO"
```

### atomicAction

> **alias**: `action`

```javascript
store.dispatch(atomicAction("ADD_TODO", state =>
	state.update('todos', todos =>
		todos.concat([newTodo]))))

// action.name === "ADD_TODO"
```

```javascript
// Is the same as `name(state => state, "ALARM")`

store.dispatch(atomicAction("ALARM"));
// action.name === "ALARM"
```

Default Reducer
---------------

```javascript
function defaultReducer(state, action) {
	if (["ADD_TODO", "GET_TODO"].indexOf(action.name) !== -1)
	{
		return visibleFilter(() => "SHOW_ALL")(state);
	}
}

let store = createStore(createAtomicReducer(initialState, defaultReducer),
	applyMiddleware(atomicThunk));
```

Async Atomic Action
-------------------

```javascript
function getTodos() {
	return api.get('/api/todos')
		.then(todos => pre => Object.assign({}, pre, { todos }));
}

getTodos.then(store.dispatch);
```

Changelog
---------

Visit [Github Releases](https://github.com/clitetailor/redux-atomic-action/releases) page for more information.