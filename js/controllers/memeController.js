'use strict'

let gElCanvas
let gCtx
let gDraggingLineIdx

function onMemeInit() {
  gElCanvas = getEl('canvas')
  gCtx = gElCanvas.getContext('2d')
  toggleView()
  addListeners()
  renderMeme()
  renderStickers()
  resizeCanvas()
}

function renderStickers() {
  const stickers = getStickers()
  const elStickersContainer = getEl('.stickers')
  let stickersHtml = ''
  stickers.forEach((sticker, idx) => {
    stickersHtml += `<img src="${sticker.url}" alt="" onclick="onAddSticker(${idx})">
    `
  })
  elStickersContainer.innerHTML = stickersHtml
}

function onAddSticker(stickerIdx) {
  const selectedSticker = getStickers()[stickerIdx]
  const newStickerLine = {
    sticker: true,
    url: selectedSticker.url,
    // x: gElCanvas.width / 2,
    // y: gElCanvas.height / 2,
    boundingBox: {
      x: 150,
      y: 150,
      width: 50,
      height: 50,
    },
  }
  gMeme.lines.push(newStickerLine)
  gMeme.selectedLineIdx = gMeme.lines.length - 1 // Set the selected line to the new sticker
  renderMeme() // Render the meme with the new sticker selected
}

function toggleView() {
  getEl('.gallery').classList.add('hidden')
  getEl('.editor').classList.remove('hidden')
  getEl('.gallery-link').classList.remove('active')
  getEl('.saved-memes').classList.add('hidden')
}

function addListeners() {
  window.addEventListener('resize', () => {
    resizeCanvas()
    renderMeme()
  })
  gElCanvas.addEventListener('click', (event) => {
    onLineClick(event)
  })
  getEl('.font-dropdown').addEventListener('change', (event) => {
    onChangeFont(event.target)
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      moveLine(event.key === 'ArrowUp' ? -1 : 1) // Move line up or down
    }
  })
  addMouseListeners()
  addTouchListeners()
}

function addMouseListeners() {
  gElCanvas.addEventListener('mousedown', handleCanvasMouseDown)
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchstart', handleCanvasTouchStart)
  gElCanvas.addEventListener('touchmove', handleCanvasTouchMove)
  gElCanvas.addEventListener('touchend', handleCanvasTouchEnd)
}

function handleCanvasMouseDown(event) {
  const rect = gElCanvas.getBoundingClientRect()
  const scaleX = gElCanvas.width / rect.width
  const scaleY = gElCanvas.height / rect.height

  const clickX = event.offsetX * scaleX
  const clickY = event.offsetY * scaleY

  for (let i = 0; i < gMeme.lines.length; i++) {
    const line = gMeme.lines[i]
    const { x, y, width, height } = line.boundingBox

    if (
      clickX >= x &&
      clickX <= x + width + 100 &&
      clickY >= y &&
      clickY <= y + height
    ) {
      gMeme.selectedLineIdx = i
      gDraggingLineIdx = i
      renderMeme()

      document.addEventListener('mousemove', handleCanvasMove)
      document.addEventListener('mouseup', handleCanvasRelease)
      break
    }
  }
}

function handleCanvasMove(event) {
  if (gDraggingLineIdx === null) return

  const rect = gElCanvas.getBoundingClientRect()
  const scaleX = gElCanvas.width / rect.width
  const scaleY = gElCanvas.height / rect.height

  const moveX = event.offsetX * scaleX
  const moveY = event.offsetY * scaleY

  const line = gMeme.lines[gDraggingLineIdx]
  if (line.sticker) {
    line.boundingBox.x = moveX
    line.boundingBox.y = moveY
  } else {
    line.prevAlign = line.align
    line.align = 'left'
    line.x = moveX
    line.y = moveY
  }
  renderMeme()
}

function handleCanvasRelease(event) {
  document.removeEventListener('mousemove', handleCanvasMove)
  document.removeEventListener('mouseup', handleCanvasRelease)

  const line = gMeme.lines[gDraggingLineIdx]
  if (line && line.prevAlign) {
    line.align = line.prevAlign
    delete line.prevAlign
  }

  gDraggingLineIdx = null
}

function handleCanvasTouchStart(event) {
  const rect = gElCanvas.getBoundingClientRect()
  const touch = event.touches[0]

  const scale = gElCanvas.width / gElCanvas.getBoundingClientRect().width
  const touchX = (touch.clientX - rect.left) * scale
  const touchY = (touch.clientY - rect.top) * scale

  for (let i = 0; i < gMeme.lines.length; i++) {
    const line = gMeme.lines[i]
    if (
      touchX >= line.boundingBox.x &&
      touchX <= line.boundingBox.x + line.boundingBox.width &&
      touchY >= line.boundingBox.y &&
      touchY <= line.boundingBox.y + line.boundingBox.height
    ) {
      gMeme.selectedLineIdx = i
      gDraggingLineIdx = i
      renderMeme()
      break
    }
  }
}

function handleCanvasTouchMove(event) {
  if (gDraggingLineIdx === null) return

  const rect = gElCanvas.getBoundingClientRect()
  const touch = event.touches[0]

  const scale = gElCanvas.width / gElCanvas.getBoundingClientRect().width
  const moveX = (touch.clientX - rect.left) * scale
  const moveY = (touch.clientY - rect.top) * scale

  const line = gMeme.lines[gDraggingLineIdx]

  if (line.sticker) {
    line.boundingBox.x = moveX
    line.boundingBox.y = moveY
  } else {
    line.prevAlign = line.align
    line.align = 'left'
    line.x = moveX
    line.y = moveY
  }

  renderMeme()
  event.preventDefault()
}

function handleCanvasTouchEnd(event) {
  const line = gMeme.lines[gDraggingLineIdx]
  if (line && line.prevAlign) {
    line.align = line.prevAlign
    delete line.prevAlign
  }

  gDraggingLineIdx = null
}

function moveLine(direction) {
  const selectedLine = getSelectedLine()
  selectedLine.y += direction * 10
  renderMeme()
}

function onLineClick({ offsetX, offsetY }) {
  const meme = getMeme()

  let clickedLineIdx = -1

  meme.lines.forEach((line, i) => {
    let textWidth = gCtx.measureText(line.txt).width
    if (i === 0) textWidth *= 3
    const textHeight = line.size

    if (line.sticker) {
      const stickerImg = new Image()
      stickerImg.src = line.url

      stickerImg.onload = () => {
        if (
          offsetX >= line.x &&
          offsetX <= line.x + stickerImg.width &&
          offsetY >= line.y &&
          offsetY <= line.y + stickerImg.height
        ) {
          clickedLineIdx = i
          if (clickedLineIdx !== -1) {
            meme.selectedLineIdx = clickedLineIdx
            renderMeme()
          }
        }
      }
    } else {
      if (
        offsetX >= line.x - textWidth / 2 &&
        offsetX <= line.x + textWidth / 2 &&
        offsetY >= line.y - textHeight / 2 &&
        offsetY <= line.y + textHeight / 2
      ) {
        clickedLineIdx = i
        if (clickedLineIdx !== -1) {
          meme.selectedLineIdx = clickedLineIdx
          renderMeme()
        }
      }
    }
  })
}

function renderMeme() {
  const meme = getMeme()

  const elImg = new Image()
  let imgUrl = meme.url
  if (!imgUrl) imgUrl = getImgUrlByIdx(meme.selectedImgIdx)
  elImg.src = imgUrl
  meme.imgURL = imgUrl

  elImg.onload = () => {
    coverCanvasWithImg(elImg)

    meme.lines.forEach((line, i) => {
      if (line.sticker) {
        const stickerImg = new Image()
        stickerImg.src = line.url
        stickerImg.onload = () => {
          if (i === meme.selectedLineIdx) {
            gCtx.strokeStyle = 'red'
            gCtx.lineWidth = 1
            gCtx.strokeRect(
              line.boundingBox.x,
              line.boundingBox.y,
              line.boundingBox.width,
              line.boundingBox.height
            )
            gCtx.strokeStyle = 'black'
          }
          gCtx.drawImage(
            stickerImg,
            line.boundingBox.x,
            line.boundingBox.y,
            line.boundingBox.width,
            line.boundingBox.height
          )
        }
      } else {
        if (!line.x || !line.y) {
          line.x = gElCanvas.width / 2
          line.y =
            (gElCanvas.height / (meme.lines.length + 1)) * (i + 1) +
            line.size / 2
        }
        const isSelected = i === meme.selectedLineIdx

        // Calculate textWidth and textHeight based on the line's text and font size
        const textWidth = gCtx.measureText(line.txt).width
        const textHeight = line.size

        // Calculate the bounding box dimensions
        const boundingBox = {
          x: line.x - textWidth / 2,
          y: line.y - textHeight / 2,
          width: textWidth,
          height: textHeight,
        }

        // Set the bounding box property
        line.boundingBox = boundingBox

        drawText(line, isSelected)
      }
    })
  }

  const elTextInput = getEl('.text-input')
  if (meme.lines.length && meme.lines[meme.selectedLineIdx])
    elTextInput.value = meme.lines[meme.selectedLineIdx].txt || ''
}

function coverCanvasWithImg(elImg) {
  gElCanvas.height =
    (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
  gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}

function resizeCanvas() {
  const elContainer = getEl('.canvas-container')
  gElCanvas.width = elContainer.offsetWidth
  gElCanvas.height = elContainer.offsetHeight
}

function drawText(line, isSelected) {
  gCtx.lineWidth = 3
  gCtx.strokeStyle = 'black'
  gCtx.textAlign = line.align
  gCtx.textBaseline = 'middle'
  const textHeight = 30
  const padding = 5

  let textWidth = gCtx.measureText(line.txt).width
  if (gMeme.selectedLineIdx === 0) textWidth *= 2.7

  if (isSelected) {
    let x = line.x
    if (line.align === 'center') {
      x = gElCanvas.width / 2 - textWidth / 2
    } else if (line.align === 'right') {
      x = gElCanvas.width / 2 - textWidth
    }
    gCtx.beginPath()
    gCtx.rect(
      x - padding,
      line.y - textHeight + padding,
      textWidth + 2 * padding,
      textHeight + 2 * padding + 10
    )
    gCtx.strokeStyle = 'red'
    gCtx.lineWidth = 1
    gCtx.stroke()
    gCtx.strokeStyle = 'black'
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.fillStyle = line.color
    drawUnderline(line)
  } else {
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.fillStyle = line.color
    drawUnderline(line)
  }

  gCtx.strokeText(line.txt, line.x, line.y)
  gCtx.fillText(line.txt, line.x, line.y)
}

function drawUnderline(line) {
  const padding = 5
  let textWidth = gCtx.measureText(line.txt).width
  if (line.underline) {
    gCtx.beginPath()
    gCtx.moveTo(line.x - textWidth / 2, line.y + padding * 4)
    gCtx.lineTo(line.x + textWidth / 2, line.y + padding * 4)
    gCtx.lineWidth = 2
    gCtx.stroke()
  }
}

function onTextChange({ value }) {
  setLineTxt(value)
  renderMeme()
}

function downloadImg(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
}

function openColorPicker() {
  const colorInput = getEl('.color-picker')
  colorInput.click()
}

function onColorChange({ value }) {
  setTextColor(value)
  renderMeme()
}

function onFontSizeChange(diff) {
  setFontSize(diff)
  renderMeme()
}

function onAddLine() {
  addLine()
  renderMeme()
  const elTextInput = getEl('.text-input')
  elTextInput.focus()
  elTextInput.value = ''
}

function onSwitchLine() {
  switchLineIdx()
  renderMeme()
}

function onDeleteLine() {
  deleteLine()
  renderMeme()
}

function onAlign(allignment) {
  setAlignment(allignment)
  renderMeme()
}

function onChangeFont({ value }) {
  setLineFont(value)
  renderMeme()
}

function onUnderline() {
  const selectedLine = getSelectedLine()
  if (selectedLine) {
    selectedLine.underline = !selectedLine.underline
    renderMeme()
  }
  renderMeme()
}

function toggleShareMenu() {
  getEl('.tooltip').classList.toggle('show-tooltip')
}

function onLineClick({ offsetX, offsetY }) {
  const meme = getMeme()

  let clickedLineIdx = -1

  meme.lines.forEach((line, i) => {
    let textWidth = gCtx.measureText(line.txt).width
    if (i === 0) textWidth *= 3
    const textHeight = line.size

    if (line.sticker) {
      const stickerImg = new Image()
      stickerImg.src = line.url

      stickerImg.onload = () => {
        if (
          offsetX >= line.x &&
          offsetX <= line.x + stickerImg.width &&
          offsetY >= line.y &&
          offsetY <= line.y + stickerImg.height
        ) {
          clickedLineIdx = i
          if (clickedLineIdx !== -1) {
            meme.selectedLineIdx = clickedLineIdx
            renderMeme()
          }
        }
      }
    } else {
      if (
        offsetX >= line.x - textWidth / 2 &&
        offsetX <= line.x + textWidth / 2 &&
        offsetY >= line.y - textHeight / 2 &&
        offsetY <= line.y + textHeight / 2
      ) {
        clickedLineIdx = i
        if (clickedLineIdx !== -1) {
          meme.selectedLineIdx = clickedLineIdx
          renderMeme()
        }
      }
    }
  })
}

function onSaveMeme() {
  saveMemeToStorage()
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
    window.open(`https://twitter.com/intent/tweet?url=${url}`)
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
