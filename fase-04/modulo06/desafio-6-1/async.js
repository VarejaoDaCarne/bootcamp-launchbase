function double(x) {
  return x * 2
}

function doublePromise(x) {
  return new Promise(function(resolve) {
      setTimeout(function() {
          resolve({ x, double: double(x)})
      }, Math.round(Math.random() * 10000))
  })
}

async function doubleAsync() {
  let result = await doublePromise(1)
  console.log(`${result.x} * 2 = ${result.double}`)

  result = await doublePromise(2)
  console.log(`${result.x} * 2 = ${result.double}`)
  
  result = await doublePromise(3)
  console.log(`${result.x} * 2 = ${result.double}`)
  
  result = await doublePromise(4)
  console.log(`${result.x} * 2 = ${result.double}`)
  
  result = await doublePromise(5)
  console.log(`${result.x} * 2 = ${result.double}`)
}

doubleAsync()