import * as _ from 'hamjest'

_.assertThat(1, _.equalTo(1))
_.assertThat('Reason', 1, _.equalTo(1))

_.assertThat(1, _.is(_.equalTo(1)))

_.assertThat(2, _.not(_.equalTo(1)))
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

_.assertThat(undefined, _.undef())
_.assertThat(undefined, _.undefined())
_.assertThat(undefined, _.defined())



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