'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');

function asSelfDescribing(value) {
	if (!value || !_.isFunction(value.describeTo)) {
		return {
			describeTo: function (description) {
				description.appendValue(value);
			}
		};
	}
	else {
		return value;
	}
}

function Description() {
	let value = '';
	return {
		useJsonForObjects: true,
		indentation: 0,
		append: function (text) {
			if (this.indentation) {
				text = ('' + text).replace('\n', _.padRight('\n', this.indentation + 1, '\t'));
			}
			try {
				value += text;
			}
			catch (e) {
				value += '[ ' + typeof text + ']';
			}
			return this;
		},
		indented: function (describingfn) {
			this.indentation += 1;
			const result = describingfn();
			if (result && _.isFunction(result.then)) {
				return Bluebird.resolve(result)
				.finally(() => this.indentation -= 1);
			}
			else {
				this.indentation -= 1;
				return result;
			}
		},
		appendDescriptionOf: function (selfDescribing) {
			if (selfDescribing && _.isFunction(selfDescribing.describeTo)) {
				selfDescribing.describeTo(this);
			}
			else {
				this.appendValue(selfDescribing);
			}
			return this;
		},
		appendValue: function (value) {
			if (_.isUndefined(value)) {
				this.append('undefined');
			}
			else if (_.isNull(value)) {
				this.append('null');
			}
			else if (_.isString(value)) {
				this.append('"');
				this.append(value);
				this.append('"');
			}
			else if (_.isNumber(value)) {
				this.append('<');
				this.append(value);
				this.append('>');
			}
			else if (_.isArray(value)) {
				this.appendList('[', ', ', ']', value);
			}
			else if (isDomNode(value)) {
				this.append('DOM node ')
					.appendValue(_.isFunction(value.html) ? value.html() : value.outerHTML);
			}
			else if (_.isFunction(value)) {
				this.append('Function' + (value.name  ? ' ' + value.name : ''));
			}
			else if (_.isRegExp(value)) {
				this.append(value.toString());
			}
			else if (this.useJsonForObjects) {
				try {
					this.append(JSON.stringify(value));
				}
				catch (e) {
					const oldJsonFlag = this.useJsonForObjects;
					this.useJsonForObjects = false;
					this.appendNonJson(value);
					this.useJsonForObjects = oldJsonFlag;
				}
			}
			else {
				this.append(value);
			}
			return this;
		},
		appendNonJson: function (value) {
			this.append('{');
			let first = true;
			_.forEach(value, function (innerValue, key) {
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
		appendList: function (start, separator, end, list) {
			this.append(start);
			_.forEach(list, function (value, index) {
				if (index !== 0) {
					this.append(separator);
				}
				this.appendDescriptionOf(asSelfDescribing(value));
			}, this);
			this.append(end);
			return this;
		},
		get: function () {
			return value;
		}
	};

	function isDomNode(value) {
		if (!value) {
			return false;
		}
		return _.isFunction(value.appendChild) && _.isFunction(value.isEqualNode) && !_.isUndefined(value.outerHTML) ||
			_.isFunction(value.html) && _.isFunction(value.text);
	}
}

module.exports = Description;
