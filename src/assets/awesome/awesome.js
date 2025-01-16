// 設定 icon
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import 要的 icons */
import { faWineGlass } from '@fortawesome/free-solid-svg-icons'


/* add icons to the library */
// library.add( faThumbsUp, faLocationDot, faFaceSmile, faScaleBalanced, faInstagram, faSquareFacebook, faLine )

library.add( faWineGlass )

export { FontAwesomeIcon }