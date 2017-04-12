function clone(object) {
	if (Array.isArray(object)) {
		return object.slice();
	}
	return Object.assign({}, object);
}

function updateIn(object, keys, callback) {
	if (keys.length === 0) {
		return callback(object);
	}

	object = clone(object);
	object[keys[0]] = updateIn(object[keys[0]], keys.slice(1), callback);

	return object;
}

function isFunction(arg) {
	return typeof (arg) === 'function';
}

module.exports = {
	clone,
	updateIn,
	isFunction
}