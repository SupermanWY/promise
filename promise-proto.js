// Promise.prototype.catch = function(onRejected) {
//   return this.then(null, onRejected)
// }

Promise.resolve().finally(() => console.log(a)).catch(a => console.log(a))

Promise.prototype.finally = function(onFinished) {
  return this.then(val => {
    onFinished()
    return val
  }).catch((err) => {
    onFinished()
    return err
  })
}

Promise.resolve = function(val) {
  return new Promise(resolve => {
    resolve(val)
  })
}

Promise.reject = function(err) {
  return new Promise((resolve, reject) => {
    reject(err)
  })
}

Promise.all = function(ps) {
  let resolve
  let reject
  const promise = new Promise((r, j) => {
    resolve = r
    reject = j
  })

  let fufilledCount = 0
  let index = 0;
  const ret = [];
  const wrapFufilled = i => {
    return val => {
      fufilledCount += 1
      ret[i] = val
      if (fufilledCount >= index) {
        resolve(ret)
      }
    } 
  }
  const wrapRejected = i => {
    return err => {
      reject(err)
    }
  }

  for (let p of ps) {
    Promise.resolve(p).then(wrapFufilled(index), wrapRejected(index))
    index += 1
  }

  return promise
}

Promise.race = function(ps) {
  let resolve
  let reject
  const promise = new Promise((r, j) => {
    resolve = r
    reject = j
  })

  for (let p of ps) {
    Promise.resolve(p).then(
      val => resolve(val),
      err => reject(err)
    )
  }

  return promise
}

Promise.any = function(ps) {
  let resolve
  let reject
  const promise = new Promise((r, j) => {
    resolve = r
    reject = j
  })

  let errCount = 0
  let pCount = 0
  for (let p of ps) {
    pCount += 1
    Promise.resolve(p).then(
      val => resolve(val),
      err => {
        errCount += 1
        if (errCount >= pCount) {
          reject(new AggregateError('All promises were rejected'))
        }
      }
    )
  }

  return promise
}

Promise.allSettled = function(ps) {
  let resolve
  let reject
  const promise = new Promise((r, j) => {
    resolve = r
    reject = j
  })

  let finishedCount = 0
  let index = 0;
  const ret = [];
  const wrapFufilled = i => {
    return val => {
      finishedCount += 1
      ret[i] = {
        status: 'fufilled',
        value: val
      }
      if (finishedCount >= index) {
        resolve(ret)
      }
    } 
  }
  const wrapRejected = i => {
    return err => {
      finishedCount += 1
      ret[i] = {
        status: 'rejected',
        value: err
      }
      if (finishedCount >= index) {
        resolve(ret)
      }
    }
  }

  for (let p of ps) {
    Promise.resolve(p).then(wrapFufilled(index), wrapRejected(index))
    index += 1
  }

  return promise
}