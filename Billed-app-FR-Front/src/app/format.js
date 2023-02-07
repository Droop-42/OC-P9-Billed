export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}

 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}

export const fileValidation = (file) => {
  console.log('file?', file)
  var fileInput = file
  var filePath = fileInput.name//value;
  console.log('filepath?', filePath)
  var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
  const alertForm = document.createElement("div");
  alertForm.classList.add("alertFormat")
  alertForm.setAttribute('data-testid', 'alertFormat')
  alertForm.id = 'alertFormat'
  alertForm.innerHTML = 'Uniquement les formats jpeg/jpg/png sont acceptés!'
  if(!allowedExtensions.exec(filePath) || filePath==''){
      //alert('Please upload file having extensions .jpeg/.jpg/.png only.');
      fileInput.value = '';
      document.querySelector(`input[data-testid="file"]`).after(alertForm)
      return false;
  }else{
    try {
      document.getElementById('alertFormat').innerHTML = ''//.remove()
    } catch (error) {
      console.log('-')
    }
      return true
  }
}