import {assertThat, equalTo} from '../../../index.js';

assertThat('If this test fails, ESM named-imports (might) fail.', 0, equalTo(0));
