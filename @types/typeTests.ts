import * as _ from 'hamjest'

_.assertThat(1, _.equalTo(1))
_.assertThat('Reason', 1, _.equalTo(1))

_.assertThat(1, _.is(_.equalTo(1)))

_.assertThat(2, _.not(_.equalTo(1)))
_.assertThat(2, _.is(_.not(_.equalTo(1))))


_.assertThat(true, _.truthy())
_.assertThat(false, _.falsy())

_.assertThat(false, _.anything())