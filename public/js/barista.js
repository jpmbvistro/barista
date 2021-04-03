
/**************************
Complete Drink
***************************/
Array.from(document.querySelectorAll('.completeDrink')).forEach((item, i)=>{
  item.addEventListener('click', element => {
    fetch('complete', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        _id: element.currentTarget.parentElement.parentElement.querySelector('.id').value,
        complete: element.currentTarget.parentElement.parentElement.querySelector('.isComplete').value==='true'

      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      console.log(data)
      window.location.reload(true)
    })
  })
})

/**************************
Clear Drink
***************************/
Array.from(document.querySelectorAll('.clearDrink')).forEach((item, i)=>{
  item.addEventListener('click', element => {
    fetch('clear', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        _id: element.currentTarget.parentElement.parentElement.querySelector('.id').value
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      console.log(data)
      window.location.reload(true)
    })
  })
})
