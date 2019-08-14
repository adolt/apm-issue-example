import { init } from '@elastic/apm-rum'

const apm = init({
  serviceName: 'test',
})

export default apm
