'use strict'

let gElCanvas
let gCtx
const gDragDrop = {}

function onMemeInit() {
  gElCanvas = getEl('canvas')
  gCtx = gElCanvas.getContext('2d')
  addListeners()
  renderMeme()
  renderStickers()
  resizeCanvas()
}

function addListeners() {
  window.addEventListener('resize', resizeCanvas)
  getEl('.font-dropdown').addEventListener('change', onChangeFont)
  document.addEventListener('keydown', handleArrowMove)

  addCanvasEventListeners()
}

function addCanvasEventListeners() {
  gElCanvas.addEventListener('click', onLineClick)
  gElCanvas.addEventListener('touchend', onLineClick)
  gElCanvas.addEventListener('mousedown', handleCanvasInteractionStart)
  gElCanvas.addEventListener('touchstart', handleCanvasInteractionStart)
}

function getEvPos(ev) {
  let pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }

  if (gDragDrop.isActive) {
    ev.preventDefault()
    ev = ev.changedTouches[0]
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
  }
  return pos
}

function handleCanvasInteractionStart(ev) {
  ev.preventDefault()
  const { type } = ev
  const { x, y } = getEvPos(ev)
  const { isActive, currLineIdx } = gDragDrop

  gDragDrop.isActive = type === 'touchstart'

  gDragDrop.currLineIdx = findLineAtPosition(x, y)
  if (currLineIdx === -1) return
  gDragDrop.isDrag = true

  gDragDrop.startPos = { x, y }

  gElCanvas.addEventListener(
    isActive ? 'touchmove' : 'mousemove',
    handleCanvasInteractionMove
  )
  document.addEventListener(
    isActive ? 'touchend' : 'mouseup',
    handleCanvasInteractionEnd
  )
}

function handleCanvasInteractionMove(ev) {
  if (!gDragDrop.isDrag) return

  const { x, y } = getEvPos(ev)
  const { startPos } = gDragDrop
  const dx = x - startPos.x
  const dy = y - startPos.y

  handleInteractionMove(dx, dy)
  gDragDrop.startPos.x = x
  gDragDrop.startPos.y = y

  renderMeme()
}

function findLineAtPosition(x, y) {
  const memeLines = getLines()

  return memeLines.findIndex(line => {
    const { x: bx, y: by, width, height } = line.boundingBox
    return x >= bx && x <= bx + width && y >= by && y <= by + height
  })
}

function handleInteractionMove(moveX, moveY) {
  if (gDragDrop.currLineIdx === -1) return

  const line = getSelectedLine()
  const { boundingBox, align } = line

  if (line.sticker) {
    boundingBox.x += moveX
    boundingBox.y += moveY
  } else {
    line.prevAlign = align
    line.align = 'left'
    line.x += moveX
    line.y += moveY
    boundingBox.x += moveX
    boundingBox.y += moveY
  }
}

function handleCanvasInteractionEnd() {
  gDragDrop.isDrag = false
  gElCanvas.removeEventListener(
    gDragDrop.isActive ? 'touchmove' : 'mousemove',
    handleCanvasInteractionMove
  )
  document.removeEventListener(
    gDragDrop.isActive ? 'touchend' : 'mouseup',
    handleCanvasInteractionEnd
  )

  if (gDragDrop.currLineIdx !== -1) {
    const line = getSelectedLine()
    if (line && line.prevAlign) {
      line.align = line.prevAlign
      delete line.prevAlign
    }
  }

  gDragDrop.currLineIdx = -1
}

function handleArrowMove(event) {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    const moveDirection = event.key === 'ArrowUp' ? -1 : 1
    const selectedLine = getSelectedLine()
    selectedLine.y += moveDirection * 10
    renderMeme()
  }
}

function onLineClick(ev) {
  const meme = getMeme()
  let x, y

  if (ev.type === 'click') {
    x = ev.offsetX
    y = ev.offsetY
  } else if (ev.type === 'touchend') {
    const { clientX, clientY, target } = ev.changedTouches[0]
    x = clientX - target.getBoundingClientRect().left
    y = clientY - target.getBoundingClientRect().top
  }

  const clickedLineIdx = findLineAtPosition(x, y)

  if (clickedLineIdx !== -1) {
    setSelectedLineIdx(clickedLineIdx)
    renderMeme()
  }
}

function renderMeme() {
  const meme = getMeme()
  const selectedLine = getSelectedLine()
  const elImg = new Image()

  elImg.src = meme.url || getImgUrlByIdx(meme.selectedImgIdx)
  setMemeUrl(elImg.src)

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
  if (meme.lines.length && selectedLine) {
    elTextInput.value = selectedLine.txt || ''
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

function onSaveMeme() {
  saveMemeToStorage(gElCanvas)
}
