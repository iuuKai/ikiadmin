import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  minimum: 0.1,
  showSpinner: true,
  ease: 'ease',
  speed: 500,
  trickle: false,
  trickleRate: 0.02,
  trickleSpeed: 800
})

export default NProgress
