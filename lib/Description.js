'use strict';

const _forEach = require('lodash/forEach');
const _isArray = require('lodash/isArray');
const _isFunction = require('lodash/isFunction');
const _isNull = require('lodash/isNull');
const _isNumber = require('lodash/isNumber');
const _isRegExp = require('lodash/isRegExp');
const _isString = require('lodash/isString');
const _isUndefined = require('lodash/isUndefined');
const _padEnd = require('lodash/padEnd');

function asSelfDescribing(value) {
	if (!value || !_isFunction(value.describeTo)) {
		return {
			describeTo(description) {
				description.appendValue(value);
			}
		};
	} else {
		return value;
	}
}

function makeNaNReadable(__key, value) {
	return typeof value === 'number' && isNaN(value) ? '<NaN>' : value;
}

function Description() {
	let value = '';
	return {
		useJsonForObjects: true,
		indentation: 0,
		append(text) {
			if (this.indentation) {
				text = ('' + text).replace('\n', _padEnd('\n', this.indentation + 1, '\t'));
			}
			try {
				value += text;
			} catch (e) {
				value += '[ ' + typeof text + ']';
			}
			return this;
		},
		indented(describingfn) {
			this.indentation += 1;
			const result = describingfn();
			if (result && _isFunction(result.then)) {
				const decrementIndentation = () => { this.indentation -= 1; };
				// Promise.finally based on https://www.npmjs.com/package/finally-polyfill
				return Promise.resolve(result)
					.then(
						(result) => Promise.resolve(decrementIndentation()).then(result),
						(error) => Promise.resolve(decrementIndentation()).then(() => { throw error; })
					);
			} else {
				this.indentation -= 1;
				return result;
			}
		},
		appendDescriptionOf(selfDescribing) {
			if (selfDescribing && _isFunction(selfDescribing.describeTo)) {
				selfDescribing.describeTo(this);
			} else {
				this.appendValue(selfDescribing);
			}
			return this;
		},
		appendValue(value, indentLists) {
			if (_isUndefined(value)) {
				this.append('undefined');
			} else if (_isNull(value)) {
				this.append('null');
			} else if (_isString(value)) {
				this.append('"');
				this.append(value);
				this.append('"');
			} else if (_isNumber(value)) {
				this.append('<');
				this.append(value);
				this.append('>');
			} else if (_isArray(value)) {
				if (indentLists && value.length > 1) {
					this.indented(() => this.appendList('[\n', ',\n', '', value))
						.append('\n]');
				} else {
					this.appendList('[', ', ', ']', value);
				}
			} else if (isDomNode(value)) {
				this.append('DOM node ')
					.appendValue(_isFunction(value.html) ? value.html() : value.outerHTML);
			} else if (_isFunction(value)) {
				this.append('Function' + (value.name  ? ' ' + value.name : ''));
			} else if (_isRegExp(value)) {
				this.append(value.toString());
			} else if (this.useJsonForObjects) {
				try {
					this.append(JSON.stringify(value, makeNaNReadable));
				} catch (e) {
					const oldJsonFlag = this.useJsonForObjects;
					this.useJsonForObjects = false;
					this.appendNonJson(value);
					this.useJsonForObjects = oldJsonFlag;
				}
			} else {
				this.append(value);
			}
			return this;
		},
		appendNonJson(value) {
			this.append('{');
			let first = true;
			_forEach(value, (innerValue, key) => {
				if (!first) {
					this.append(', ');
				}
				first = false;
				this.append(key)
					.append(': ');
				this.appendValue(innerValue);
			}, this);
			this.append('}');
		},
		appendList(start, separator, end, list) {
			this.append(start);
			_forEach(list, (value, index) => {
				if (index !== 0) {
					this.append(separator);
				}
				this.appendDescriptionOf(asSelfDescribing(value));
			}, this);
			this.append(end);
			return this;
		},
		get() {
			return value;
		}
	};

	function isDomNode(value) {
		if (!value) {
			return false;
		}
		return _isFunction(value.appendChild) && _isFunction(value.isEqualNode) && !_isUndefined(value.outerHTML) ||
			_isFunction(value.html) && _isFunction(value.text);
	}
}

module.exports = Description;
