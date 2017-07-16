import Vuex from 'vuex'
import content from '../content/content.js'

const store = () => new Vuex.Store({
  state: {
    content: content
  }
})

export default store
