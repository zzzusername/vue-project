
// import axios from 'axios'

const list = [
  {'id': 1, 'title': 'iPad 4 Mini', 'price': 500.01, 'inventory': 2},
  {'id': 2, 'title': 'H&M T-Shirt White', 'price': 10.99, 'inventory': 10},
  {'id': 3, 'title': 'Charli XCX - Sucker CD', 'price': 19.99, 'inventory': 5}
]

export default {
  getAll (cb) {
    // axios.get('/user?ID=12345')
    //   .then(function (response) {
    //     cb(list)
    //     console.log(response)
    //   })
    //   .catch(function (error) {
    //     cb(list)
    //     console.log(error)
    //   })
    console.log('获取数据了')
    setTimeout(() => cb(list), 100)
  },

  add (item, cb, errorCb) {
    console.log(item)
    console.log('s')
    setTimeout(() => {
      // simulate random checkout failure.
      Math.random() > 0.5 ? cb() : errorCb()
    }, 100)
  }
}
