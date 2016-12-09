class Base {
  constructor() {
  }

  fetch() {
    throw Error('you should overwrite this method')
  }
}

export default Base
