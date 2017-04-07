function createAtomicReducer(initialState) {
	function atomicReducer(previousState = initialState, action) {
		if (action.type === "ATOMIC_ACTION") {
			return action.value;
		}
		else {
			return previousState;
		}
	}

	return atomicReducer
}

function clone(object) {
	if (Array.isArray(object)) {
		return object.slice();
	}
	return Object.assign({}, object);
}

function setIn(object, keys, callback) {
	if (keys.length === 0) {
		return callback(object);
	}

	object = clone(object);
	object[keys[0]] = setIn(object[keys[0]], keys.slice(1), callback);

	return object;
}

function createStateModifier(route) {

	if (!Array.isArray(route)) {
		route = [route];
	}

	return function (callback) {
		let o = {
			[callback.name]: function (object) {
				return setIn(object, route, callback);
			}
		}

		return o[callback.name]
	}
}

const atomicThunk = store => next => action => {
	if (typeof action === 'function') {
		return next({
			type: "ATOMIC_ACTION",
			name: action.name,
			value: action(store.getState())
		});
	} else {
		next(action)
	}
}

module.exports = {
	createAtomicReducer,
	atomicThunk,
	createStateModifier
};