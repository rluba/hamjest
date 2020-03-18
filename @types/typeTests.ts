import * as _ from 'hamjest'

_.assertThat(1, _.equalTo(1))
_.assertThat('Reason', 1, _.equalTo(1))

_.assertThat(1, _.is(_.equalTo(1)))

_.assertThat(1, _.not(_.equalTo(1)))