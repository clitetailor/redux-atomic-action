const { clone, isFunction, updateIn } = require('./utils');


function createAtomicReducer(initialState, defaultReducer) {
	if (!defaultReducer) {
		defaultReducer = state => state;
	}

	function atomicReducer(previousState = initialState, action) {
		if (action.type === "ATOMIC_ACTION") {
			return defaultReducer(action.atomicModifier(previousState), action);
		}
		else {
			return previousState;
		}
	}

	return atomicReducer
}



function createStateModifier(route, keepFuncName) {

	if (!Array.isArray(route)) {
		route = [route];
	}

	if (keepFuncName === undefined || keepFuncName) {
		return function (callback) {
			const o = {
				[callback.name]: function (target) {
					return updateIn(target, route, callback);
				}
			}

			return o[callback.name];
		}
	}
	else {
		return function (callback) {
			return function (target) {
				updateIn(target, route, callback);
			}
		}
	}
}



const atomicThunk = store => next => action => {
	if (isFunction(action)) {
		return next({
			type: "ATOMIC_ACTION",
			name: action.name,
			atomicModifier: action
		});
	} else {
		next(action)
	}
}



function name(func, funcName) {
	const o = {
		[funcName]: function (...args) {
			return func(...args);
		}
	}

	return o[funcName];
}

let nameFunc = name;



function atomicAction(name) {
	const o = {
		[name]: function (state) {
			return state;
		} 
	}

	return o[name];
}

let action = atomicAction;



module.exports = {
	createAtomicReducer,
	atomicThunk,
	createStateModifier,
	name,
	nameFunc,
	action,
	atomicAction
};