let should = require('chai').should(),
	{ createStore, applyMiddleware } = require('redux');

let { createAtomicReducer, atomicThunk, createStateModifier } = require('../lib/index');


describe('#createAtomicReducer()', function () {
	it("should return 'something'", function (done) {
		
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
			store.getState().todos.should.include('something');
			done();
		})	
		
		store.dispatch(addTodo('something'));
	})
})

describe('#action.name', function () {

	it('should equal ADD_TODO', function (done) {
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

	describe('#action.name', function () {

		it('should equal ADD_TODO', function (done) {
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
			
			let todos = createStateModifier('todos');

			function addTodo(todo) {
				let ADD_TODO = todos => todos.concat(todo);

				return todos(ADD_TODO);
			}

			store.dispatch(addTodo('something'));
		})
	})

	describe('deeply modify state test', function () {

		it('should equal ADD_TODO', function (done) {
			const initialState = {
				dashboard: {
					todos: []
				},
				visibleFilter: "SHOW_ALL"
			}

			let store = createStore(createAtomicReducer(initialState),
				applyMiddleware(atomicThunk));
			
			store.subscribe(() => {
				store.getState().dashboard.todos.should.eql(['something']);
				done();
			})

			let todos = createStateModifier(['dashboard', 'todos']);

			function addTodo(todo) {
				let ADD_TODO = todos => todos.concat(todo);

				return todos(ADD_TODO);
			}

			store.dispatch(addTodo('something'));
		})
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