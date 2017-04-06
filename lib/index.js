function createAtomicReducer(initialState) {
	return function (preState = initialState, action) {
		if (action.type === "ATOMIC_ACTION") {
			return action.value;
		}
		else {
			return preState;
		}
	}
}

function createStateModifier(state) {
	return function (atomicAction) {
		
		let o = {
			[atomicAction.name]: function (preState) {
				return Object.assign({}, preState, {
					[state]: atomicAction(preState[state])
				})
			}
		};

		return o[atomicAction.name]
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