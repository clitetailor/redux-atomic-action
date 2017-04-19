'use strict'
let should = require('chai').should();

let	{ createStore, applyMiddleware } = require('redux');

let {
	createAtomicReducer,
	atomicThunk,
	createStateModifier,
	name,
	nameFunc,
	action,
	atomicAction
} = require('../lib/index');


describe("#main features' test", function () {

	describe('#createAtomicReducer()', function () {

		it("should include 'SUBMIT_ASSIGNMENTS'", function (done) {
			
			const initialState = {
				todos: [],
				visibleFilter: "SHOW_ALL"
			}

			let store = createStore(createAtomicReducer(initialState),
				applyMiddleware(atomicThunk));

			function addTodo(todo) {
				return function(pre) {

					return Object.assign({}, pre, {
						todos: pre.todos.concat(todo)
					})
				}
			}

			store.subscribe(function() {
				store.getState().todos.should.include("SUBMIT_ASSIGNMENTS");
				done();
			})
			
			store.dispatch(addTodo('SUBMIT_ASSIGNMENTS'));
		})
	})

	describe('#action.name', function () {

		it("should equal 'ADD_TODO'", function (done) {
			const initialState = {
				todos: [],
				visibleFilter: "SHOW_ALL"
			}

			let store = createStore(createAtomicReducer(initialState),
				applyMiddleware(atomicThunk),
				applyMiddleware(store => next => action => {
					
					action.name.should.equal("ADD_TODO");
					next(action);
					done();
				}));

			function addTodo(todo) {
				let ADD_TODO = pre =>
					Object.assign({}, pre, {
						todos: pre.todos.concat(todo)
					})

				return ADD_TODO;
			}

			store.dispatch(addTodo('something'));
		})
	})

	describe("#name()", function () {
		
		it("should return a function named 'ADD_TODO'", function () {
			
			name(() => "something", "ADD_TODO").name.should.equal("ADD_TODO")
			name(() => "something", "ADD_TODO")().should.equal("something")

			nameFunc(() => "something", "ADD_TODO").name.should.equal("ADD_TODO")
			nameFunc(() => "something", "ADD_TODO")().should.equal("something")
		})
	})

	describe("#atomicAction()", function () {
		
		it("should return a function named 'NOTIFY'", function () {

			const state = [1, 2, 3]

			atomicAction("NOTIFY").name.should.equal("NOTIFY");
			atomicAction("NOTIFY")(state).should.equal(state);
		})

		it("should add a number into state array", function () {

			const state = [1, 2, 3]

			atomicAction("ADD_NUMBER", state =>
				state.concat([4]))(state)
				.should.deep.equal([1, 2, 3, 4]);
		})
	})

	describe("#defaultReducer()", function () {

		it("s' status is 'EMPTY'", function (done) {

			const initialState = {
				todos: [
					"BUY_SOME_GIFTS",
					"HAVING_DINNER"
				],
				status: "HAS_TODOS"
			}

			let defaultReducer = function (state, action) {
				if (action.name === "DELETE_ALL") {

					return Object.assign({}, state, {
						status: "EMPTY"
					});
				}
			}

			let store = createStore(
				createAtomicReducer(initialState, defaultReducer),
				applyMiddleware(atomicThunk));

			function deleteAll() {
				return name(state =>
					Object.assign({}, state, { todos: [] }), "DELETE_ALL")
			}

			store.subscribe(function () {
				store.getState().status.should.equal("EMPTY")
				done();
			})

			store.dispatch(deleteAll());
		})
	})

	describe('#createStateModifier()', function () {
		
		it("should include 'something'", function (done) {
			const initialState = {
				todos: [],
				visibleFilter: "SHOW_ALL"
			}

			let store = createStore(createAtomicReducer(initialState),
				applyMiddleware(atomicThunk));
			
			store.subscribe(() => {
				store.getState().todos.should.include('something');
				done();
			})

			let todos = createStateModifier('todos');

			function addTodo(todo) {
				let ADD_TODO = todos => todos.concat(todo);

				return todos(ADD_TODO);
			}

			store.dispatch(addTodo('something'));
		})
	})

	describe('Async atomic action', function () {
		
		it("should return new todos", function (done) {
			const initialState = {
				todos: [],
				visibleFilter: "SHOW_ALL"
			}

			let store = createStore(createAtomicReducer(initialState),
				applyMiddleware(atomicThunk));

			store.subscribe(() => {
				store.getState().todos.should.eql([1, 2, 3, 4]);
				done();
			})

			let setTodos = createStateModifier('todos');

			function getTodos() {
				return Promise.resolve([1, 2, 3, 4])
					.then(todos => {
						let GET_TODOS = () => todos;

						return setTodos(GET_TODOS);
					})
					.catch(err => done(err))
			}

			getTodos().then(store.dispatch);
		})
	})
})