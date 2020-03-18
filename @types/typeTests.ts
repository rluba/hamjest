import * as _ from 'hamjest'

_.assertThat(1, _.equalTo(1))
_.assertThat('Reason', 1, _.equalTo(1))

_.assertThat(1, _.is(_.equalTo(1)))

_.assertThat(2, _.not(_.equalTo(1)))
_.assertThat(2, _.is(_.not(_.equalTo(1))))


_.assertThat(true, _.truthy())

_.assertThat(false, _.falsy())
_.assertThat(false, _.falsey())

_.assertThat(false, _.anything())



_.assertThat([1,2,3], _.hasSize(3))

_.assertThat([], _.isEmpty())

_.assertThat(1, _.inRange(2))
_.assertThat(1, _.inRange(0, 2))

_.assertThat([1], _.hasExactlyOneItem())
_.assertThat([1], _.array())