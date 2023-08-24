function onInit() {
  renderGallery()
  addNavListener()
}

function addNavListener() {
  var header = getEl('.navbar')
  var btns = header.querySelectorAll('.nav-item')
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      let selected = document.querySelectorAll('.active')
      if (selected.length) selected[0].classList.remove('active')
      btn.classList.add('active')
    })
  })
}

function moveToGallery() {
  getEl('.gallery').classList.remove('hidden')
  getEl('.editor').classList.add('hidden')
  getEl('.saved-memes').classList.add('hidden')
}

function moveToSaved() {
  getEl('.gallery').classList.add('hidden')
  getEl('.editor').classList.add('hidden')
  getEl('.saved-memes').classList.remove('hidden')
  renderSavedMemes()
}

function onShareFacebook() {
  const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

  function onSuccess(uploadedImgUrl) {
    const url = encodeURIComponent(uploadedImgUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
  }

  doUploadImg(imgDataUrl, onSuccess)
}

function onShareTwitter() {
  const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

  function onSuccess(uploadedImgUrl) {
    const url = encodeURIComponent(uploadedImgUrl)
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`
    )
  }

  doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
  const formData = new FormData()
  formData.append('img', imgDataUrl)

  const XHR = new XMLHttpRequest()
  XHR.onreadystatechange = () => {
    if (XHR.readyState !== XMLHttpRequest.DONE) return
    if (XHR.status !== 200) return console.error('Error uploading image')
    const { responseText: url } = XHR

    onSuccess(url)
  }
  XHR.onerror = (req, ev) => {
    console.error(
      'Error connecting to server with request:',
      req,
      '\nGot response data:',
      ev
    )
  }
  XHR.open('POST', '//ca-upload.com/here/upload.php')
  XHR.send(formData)
}
