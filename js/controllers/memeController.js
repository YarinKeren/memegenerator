'use strict'

let gElCanvas
let gCtx
let gDraggingLineIdx

let gIsTouchActive = false

function onMemeInit() {
  gElCanvas = getEl('canvas')
  gCtx = gElCanvas.getContext('2d')
  addListeners()
  renderMeme()
  renderStickers()
  resizeCanvas()
}

function renderStickers() {
  const stickers = getStickers()

  const stickersHtml = stickers
    .map(
      (sticker, idx) =>
        `<img src="${sticker.url}" alt="" onclick="onAddSticker(${idx})">`
    )
    .join('')

  setElHtml('.stickers', stickersHtml)
}

function onAddSticker(stickerIdx) {
  const sticker = getSelectedSticker(stickerIdx)

  const newStickerLine = {
    sticker: true,
    url: sticker.url,
    boundingBox: {
      x: 150,
      y: 150,
      width: 50,
      height: 50,
    },
  }

  addStickerLine(newStickerLine)
  updateSelectedLine()
  renderMeme()
}

function addListeners() {
  window.addEventListener('resize', resizeCanvas)
  getEl('.font-dropdown').addEventListener('change', onChangeFont)
  document.addEventListener('keydown', handleArrowMove)

  addCanvasEventListeners()
}

function addCanvasEventListeners() {
  gElCanvas.addEventListener('click', onLineClick)
  gElCanvas.addEventListener('mousedown', handleCanvasInteractionStart)
  gElCanvas.addEventListener('touchstart', handleCanvasInteractionStart)
}

function handleCanvasInteractionStart(ev) {
  ev.preventDefault()
  const { type, touches, offsetX, offsetY } = ev

  gIsTouchActive = type === 'touchstart'

  const rect = gElCanvas.getBoundingClientRect()
  const scaleX = gElCanvas.width / rect.width
  const scaleY = gElCanvas.height / rect.height

  const interactionX = gIsTouchActive ? touches[0].clientX * scaleX : offsetX
  const interactionY = gIsTouchActive ? touches[0].clientY * scaleY : offsetY

  gDraggingLineIdx = findLineAtPosition(interactionX, interactionY)

  gElCanvas.addEventListener(
    gIsTouchActive ? 'touchmove' : 'mousemove',
    handleCanvasInteractionMove
  )
  document.addEventListener(
    gIsTouchActive ? 'touchend' : 'mouseup',
    handleCanvasInteractionEnd
  )
}

function findLineAtPosition(x, y) {
  console.log('x', x)
  console.log('y', y)
  const memeLines = getLines()

  return memeLines.findIndex(line => {
    const { x: bx, y: by, width, height } = line.boundingBox
    return x >= bx && x <= bx + width && y >= by && y <= by + height
  })
}

function handleCanvasInteractionMove(ev) {
  const { touches } = ev
  ev.preventDefault()

  const rect = gElCanvas.getBoundingClientRect()
  const scaleX = gElCanvas.width / rect.width
  const scaleY = gElCanvas.height / rect.height

  const moveX = gIsTouchActive ? touches[0].clientX * scaleX : ev.offsetX
  const moveY = gIsTouchActive ? touches[0].clientY * scaleY : ev.offsetY

  handleInteractionMove(moveX, moveY)

  renderMeme()
}

function handleInteractionMove(moveX, moveY) {
  if (gDraggingLineIdx === -1) return

  const line = getSelectedLine()
  const { boundingBox, align } = line

  if (line.sticker) {
    boundingBox.x = moveX
    boundingBox.y = moveY
  } else {
    line.prevAlign = align
    line.align = 'left'
    line.x = moveX
    line.y = moveY
  }
}

function handleCanvasInteractionEnd() {
  gElCanvas.removeEventListener(
    gIsTouchActive ? 'touchmove' : 'mousemove',
    handleCanvasInteractionMove
  )
  document.removeEventListener(
    gIsTouchActive ? 'touchend' : 'mouseup',
    handleCanvasInteractionEnd
  )

  if (gDraggingLineIdx !== -1) {
    const line = getSelectedLine()
    if (line && line.prevAlign) {
      line.align = line.prevAlign
      delete line.prevAlign
    }
  }

  gDraggingLineIdx = -1
}

function handleArrowMove(event) {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    const moveDirection = event.key === 'ArrowUp' ? -1 : 1
    const selectedLine = getSelectedLine()
    selectedLine.y += moveDirection * 10
    renderMeme()
  }
}

function onLineClick({ offsetX, offsetY }) {
  const meme = getMeme()
  const clickedLineIdx = findLineAtPosition(offsetX, offsetY)

  if (clickedLineIdx !== -1) {
    meme.selectedLineIdx = clickedLineIdx
    renderMeme()
  }
}

function renderMeme() {
  const meme = getMeme()
  const elImg = new Image()

  elImg.src = meme.url || getImgUrlByIdx(meme.selectedImgIdx)
  meme.url = elImg.src

  elImg.onload = () => {
    coverCanvasWithImg(elImg)

    meme.lines.forEach((line, i) => {
      if (line.sticker) {
        renderSticker(line, i, meme)
      } else {
        renderText(line, i, meme)
      }
    })
  }

  const elTextInput = getEl('.text-input')
  if (meme.lines.length && meme.lines[meme.selectedLineIdx]) {
    elTextInput.value = meme.lines[meme.selectedLineIdx].txt || ''
  }
}

function renderSticker(line, i, meme) {
  const stickerImg = new Image()
  const { x, y, width, height } = line.boundingBox

  stickerImg.onload = () => {
    if (i === meme.selectedLineIdx) {
      gCtx.strokeStyle = 'red'
      gCtx.lineWidth = 1
      gCtx.strokeRect(x, y, width, height)
      gCtx.strokeStyle = 'black'
    }
    gCtx.drawImage(stickerImg, x, y, width, height)
  }
  stickerImg.src = line.url
}

function renderText(line, i, meme) {
  let { x, y, size, txt } = line
  if (!x || !y) {
    line.x = gElCanvas.width / 2
    line.y = (gElCanvas.height / (meme.lines.length + 1)) * (i + 1) + size / 2
  }

  const textMetrics = gCtx.measureText(txt)
  const textWidth =
    textMetrics.actualBoundingBoxRight + textMetrics.actualBoundingBoxLeft

  const boundingBox = {
    x: x - textWidth / 2,
    y: y - size / 2,
    width: textWidth,
    height: size,
  }

  line.boundingBox = boundingBox

  const isSelected = i === meme.selectedLineIdx
  drawText(line, isSelected)
}

function coverCanvasWithImg(elImg) {
  const { naturalWidth, naturalHeight } = elImg

  gElCanvas.height = (naturalHeight / naturalWidth) * gElCanvas.width
  gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}

function resizeCanvas() {
  const { offsetWidth, offsetHeight } = getEl('.canvas-container')
  gElCanvas.width = offsetWidth
  gElCanvas.height = offsetHeight
  renderMeme()
}

function drawText(line, isSelected) {
  const { size: textHeight, txt, font, color, x, y } = line
  const padding = 5

  gCtx.lineWidth = 3
  gCtx.textAlign = line.align
  gCtx.strokeStyle = 'black'
  gCtx.textBaseline = 'middle'

  gCtx.font = `${textHeight}px ${font}`
  gCtx.fillStyle = color
  gCtx.strokeText(txt, x, y)
  gCtx.fillText(txt, x, y)

  const textWidth = gCtx.measureText(txt).width

  if (isSelected) {
    drawSelectionBox(line, textWidth, textHeight, padding)
  }

  drawUnderline(line)
}

function drawSelectionBox({ x, align, y }, textWidth, textHeight, padding) {
  if (align === 'center') {
    x = gElCanvas.width / 2 - textWidth / 2
  } else if (align === 'right') {
    x = gElCanvas.width / 2 - textWidth
  }
  gCtx.beginPath()
  gCtx.rect(
    x - padding,
    y - textHeight + padding,
    textWidth + 2 * padding,
    textHeight + 2 * padding + 10
  )
  gCtx.strokeStyle = 'red'
  gCtx.lineWidth = 1
  gCtx.stroke()
  gCtx.strokeStyle = 'black'
}

function drawUnderline({ underline, txt, x, y }) {
  const padding = 5
  const textWidth = gCtx.measureText(txt).width
  if (underline) {
    gCtx.beginPath()
    gCtx.moveTo(x - textWidth / 2, y + padding * 4)
    gCtx.lineTo(x + textWidth / 2, y + padding * 4)
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
  getEl('.color-picker').click()
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

function onChangeFont({ target }) {
  setLineFont(target.value)
  renderMeme()
}

function onUnderline() {
  const selectedLine = getSelectedLine()
  if (selectedLine) {
    selectedLine.underline = !selectedLine.underline
  }
  renderMeme()
}

function toggleShareMenu() {
  getEl('.tooltip').classList.toggle('show-tooltip')
}

function onLineClick({ offsetX, offsetY }) {
  const meme = getMeme()

  let clickedLineIdx = -1

  meme.lines.forEach(({ size: textHeight, sticker, url, x, y, txt }, idx) => {
    const textWidth = gCtx.measureText(txt).width

    if (sticker) {
      const stickerImg = new Image()
      stickerImg.src = url

      stickerImg.onload = () => {
        if (
          offsetX >= x &&
          offsetX <= x + stickerImg.width &&
          offsetY >= y &&
          offsetY <= y + stickerImg.height
        ) {
          clickedLineIdx = idx
          if (clickedLineIdx !== -1) {
            meme.selectedLineIdx = clickedLineIdx
            renderMeme()
          }
        }
      }
    } else {
      if (
        offsetX >= x - textWidth / 2 &&
        offsetX <= x + textWidth / 2 &&
        offsetY >= y - textHeight / 2 &&
        offsetY <= y + textHeight / 2
      ) {
        clickedLineIdx = idx
        if (clickedLineIdx !== -1) {
          meme.selectedLineIdx = clickedLineIdx
          renderMeme()
        }
      }
    }
  })
}

function onSaveMeme() {
  saveMemeToStorage(gElCanvas)
}
