'use strict'
let {
	createAtomicReducer,
	atomicThunk,
	createStateModifier,
	nameFunc
} = require('./lib');
let { createStore, applyMiddleware } = require('redux');

const initialState = {
	dashboard: {
		todos: []
	},
	visibleFilter: "SHOW_ALL"
}

let store = createStore(createAtomicReducer(initialState),
	applyMiddleware(atomicThunk));

store.subscribe(() => {
	console.log(store.getState().dashboard);
})

let todos = createStateModifier(['dashboard', 'todos']);
let visibleFilter = createStateModifier(['visibleFilter']);

function addTodo(todo) {
	let ADD_TODO = todos => todos.concat(todo);

	return todos(ADD_TODO);
}

function setVisibleFilter(filter) {
	let SET_VISIBLE_FILTER = () => filter;

	return visibleFilter(SET_VISIBLE_FILTER);
}

store.dispatch(addTodo('something'));
store.dispatch(addTodo('todo'));
store.dispatch(addTodo('with'));
store.dispatch(setVisibleFilter('SHOW_NOTHING'))
store.dispatch(addTodo('it!'));

console.log(nameFunc(() => { console.log('something') }, "ADD_TODO").name)