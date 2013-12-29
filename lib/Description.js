'use strict';

var _ = require('lodash-node')
	;

function asSelfDescribing(value) {
	if (_.isUndefined(value) || _.isUndefined(value.describeTo)) {
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

function escapeSpecialCharacters(value) {
	return value.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r')
		.replace(/\t/g, '\\t')
		.replace(/"/g, '\\"');
}

function Description() {
	var value = '';
	return _.create({}, {
		append: function (text) {
			value += text;
			return this;
		},
		appendDescriptionOf: function (selfDescribing) {
			selfDescribing.describeTo(this);
			return this;
		},
		appendValue: function (value) {
			if (_.isUndefined(value)) {
				this.append('undefined');
			} else if (_.isNull(value)) {
				this.append('null');
			} else if (_.isString(value)) {
				this.append('"');
				this.append(escapeSpecialCharacters(value));
				this.append('"');
			} else if (_.isNumber(value)) {
				this.append('<');
				this.append(value);
				this.append('>');
			} else if (_.isArray(value)) {
				this.appendList('[', ', ', ']', value);
			} else if (_.isFunction(value)) {
				this.append('Function' + (value.name  ? ' ' + value.name : ''));
			} else {
				this.append(JSON.stringify(value));
			}
			return this;
		},
		appendList: function(start, separator, end, list) {
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
	});
}

module.exports = Description;
