let gElCanvas
let gCtx

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
  const elStickersContainer = document.querySelector('.stickers')
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
    x: gElCanvas.width / 2, // Adjust as needed
    y: gElCanvas.height / 2, // Adjust as needed
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
    const textWidth = gCtx.measureText(line.txt).width
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
  const imgUrl = getImgUrlByIdx(meme.selectedImgIdx)
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
            // Highlight selected sticker
            gCtx.strokeStyle = 'red'
            gCtx.lineWidth = 1
            gCtx.strokeRect(line.x, line.y, stickerImg.width, stickerImg.height)
            gCtx.strokeStyle = 'black'
          }
          gCtx.drawImage(stickerImg, line.x, line.y)
        }
      } else {
        if (!line.x || !line.y) {
          line.x = gElCanvas.width / 2
          line.y =
            (gElCanvas.height / (meme.lines.length + 1)) * (i + 1) +
            line.size / 2
        }
        const isSelected = i === meme.selectedLineIdx

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
  document.querySelector('.tooltip').classList.toggle('show-tooltip')
}

function onSaveMeme() {
  saveMemeToStorage()
}
