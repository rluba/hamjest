import * as _ from 'hamjest'

_.assertThat(1, _.equalTo(1))
_.assertThat('Reason', 1, _.equalTo(1))

_.assertThat(1, _.is(_.equalTo(1)))

_.assertThat(2, _.not(_.equalTo(1)))
_.assertThat(2, _.is(_.not(_.equalTo(1))))

_.assertThat(2, _.is(_.not(_.equalTo(1))))

_.assertThat(true, _.truthy())

_.assertThat(false, _.falsy())
_.assertThat(false, _.falsey())
_.assertThat(false, _.bool())
_.assertThat(false, _.boolean())

_.assertThat(() => {}, _.func())

_.assertThat(1, _.number())
_.assertThat({}, _.object())
_.assertThat(/d+/, _.regExp())
_.assertThat('', _.string())


_.assertThat(1, _.lessThan(5))
_.assertThat(1, _.lessThanOrEqualTo(5))
_.assertThat(6, _.greaterThan(5))
_.assertThat(6, _.greaterThanOrEqualTo(5))
_.assertThat(1/3, _.closeTo(0.33, 0.01));


_.assertThat(undefined, _.undef())
_.assertThat(undefined, _.undefined())
_.assertThat(undefined, _.defined())

_.assertThat('hamjest is awesome', _.containsString('is'))
_.assertThat('hamjest is awesome', _.containsStrings('hamjest', 'is'))
_.assertThat('hamjest is awesome', _.startsWith('hamjest'))
_.assertThat('hamjest is awesome', _.endWith('awesome'))

_.assertThat('hamjest is awesome', _.matchesPattern('is'))
_.assertThat('hamjest is awesome', _.matchesPattern(/.*is.*/))


_.assertThat(Date, _.instanceOf(Date))
_.assertThat(new Date(), _.date())
_.assertThat(false, _.anything())

_.assertThat([1,2,3], _.hasSize(3))

_.assertThat([], _.isEmpty())
_.assertThat([], _.empty())

_.assertThat(1, _.inRange(2))
_.assertThat(1, _.inRange(0, 2))

_.assertThat([1], _.hasExactlyOneItem())
_.assertThat([1], _.array())

// TODO: unsure if used correctly
_.assertThat(_.containsString('value'), _.matches('some value'))
_. assertThat(_.containsString('value'), _.hasDescription('a string containing "value"'));
_. assertThat(_.hasSize(5), _.failsToMatch('long string', _.containsString('size was <11>')));
