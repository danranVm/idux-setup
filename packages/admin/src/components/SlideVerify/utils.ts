export function getRandomNumberByRange(start: number, end: number) {
  return Math.round(Math.random() * (end - start) + start)
}

export function createImg(imgs: string[], onload: () => void) {
  const img = document.createElement('img')
  img.crossOrigin = 'Anonymous'
  img.onload = onload
  img.src = imgs[getRandomNumberByRange(0, imgs.length - 1)]
  return img
}

export function drawGap(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  l: number,
  r: number,
  operation: 'fill' | 'clip',
) {
  const PI = Math.PI
  const color = 'rgba(255, 255, 255, 0.7)'
  ctx.beginPath()
  ctx.moveTo(x, y)
  // 上方的圆弧
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
  ctx.lineTo(x + l, y)
  // 右侧的圆弧
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
  ctx.lineTo(x + l, y + l)
  ctx.lineTo(x, y + l)
  // 左侧的圆弧
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
  ctx.lineTo(x, y)
  ctx.lineWidth = 2
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.stroke()
  ctx[operation]()
  ctx.globalCompositeOperation = 'destination-over'
}
