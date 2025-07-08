<template>
  <div>
		<h1 class="text-primary-800 font-bold text-3xl">
			Voxel 51 Demo
		</h1>
		<div class="flex flex-col mt-3 items-center">
			<canvas
				ref="mainCanvas" 
				class="border"
				width=800
				height=700
				@mousedown="handleMouseDown"
				@mouseup="handleMouseUp"
				@mouseleave="handleMouseLeave"
				@mousemove="handleMouseMove"
			/>
		</div>
  </div>
</template>

<script setup lang="ts">
// TODO Tasks for project:
// 1. Load in some rectangles and lines based on JSON -/
// 5. Add notch to the top of rectangle -/
// 2. Highlight rectnagle or line when clicked -/
// 3. Move rectangle or line when dragging from center -/
// 4. Resize rectangle when click-dragging on the line
import { onMounted, useTemplateRef } from 'vue'
import canvasJson from '@/assets/rectanglesAndLines.json'

type Notch = {
	x: number,
	y: number,
	width: number,
	height: number,
}

type Rectangle = {
	id: string,
	x: number,
	y: number,
	width: number,
	height: number,
	color: string,
	isHighlighted?: boolean,
	notch?: Notch
}

type Line = {
	id: string,
	startX: number,
	startY: number,
	endX: number,
	endY: number,
	color: string
}

type Vector = {
	x: number,
	y: number
}

const canvasRef = useTemplateRef('mainCanvas')
const DEFAULT_RECT_COLOR = 'rgb(78, 5, 78)'
const DEFAULT_LINE_COLOR = 'rgb(255, 0, 0)'
const HIGHLIGHT_COLOR = 'rgb(255,255,0)'
const BASE_LINE_WIDTH = 3

let rectangles: Rectangle[] | null = null
let lines: Line[] | null = null
let isMouseDown: boolean = false
let mouseOnXBorder: boolean = false
let mouseOnYBorder: boolean = false
let selectedRect: Rectangle | null = null
let mouseDownVector: Vector | null = null

const requestDraw = (): void => {
	const ctx = canvasRef.value?.getContext('2d')
	if (!ctx) {
		console.error('rednerCanvas: failed to get context')
		return
	}

	const drawNotch = (rect: Rectangle): Notch => {
		ctx.lineWidth = BASE_LINE_WIDTH
		ctx.fillStyle = rect.color || DEFAULT_RECT_COLOR
		const notch = {
			x: rect.x + 10,
			y: rect.y - Math.ceil(BASE_LINE_WIDTH * 2.5),
			width: 20,
			height: 10
		}
		ctx.fillRect(notch.x, notch.y, notch.width, notch.height)
		return notch
	}

	const renderCanvas = (): void => {
		ctx.clearRect(0, 0, (canvasRef.value?.width || 800), (canvasRef.value?.height || 700))

		ctx.lineWidth = BASE_LINE_WIDTH
		rectangles?.forEach(rect => {
			if (rect.isHighlighted) {
				ctx.strokeStyle = HIGHLIGHT_COLOR
			} else {
				ctx.strokeStyle = rect.color || DEFAULT_RECT_COLOR
			}
			ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
			rect.notch = drawNotch(rect)
		})

		lines?.forEach(line => {
			ctx.strokeStyle = line.color || DEFAULT_LINE_COLOR
			ctx.beginPath()
			ctx.moveTo(line.startX, line.startY)
			ctx.lineTo(line.endX, line.endY)
			ctx.stroke()
			ctx.closePath()
		})
	}

	// TODO use requestAnimationFrame()
	renderCanvas()
}

const isCursorWithinRect = (cursorX: number, cursorY: number, rect: Rectangle | Notch): boolean => {
	return (((rect.x <= cursorX && cursorX <= rect.x + rect.width) || (rect.x >= cursorX && cursorX >= rect.x + rect.width)) && 
	((rect.y <= cursorY && cursorY <= rect.y + rect.height) || (rect.y >= cursorY && cursorY >= rect.y + rect.height)))
}

const isCursorOnRectBorder = (cursorX: number, cursorY: number, rect: Rectangle) => {
	const isLeftBorder = (rect.x <= cursorX && cursorX <= rect.x + BASE_LINE_WIDTH) && (rect.y <= cursorY && cursorY <= rect.y + rect.height)
	const isRightBorder = (rect.x + rect.width <= cursorX && cursorX <= rect.x + rect.width + BASE_LINE_WIDTH) && (rect.y <= cursorY && cursorY <= rect.y + rect.height)
	// const isTopBorder = ()
	return isLeftBorder || isRightBorder
}

const handleMouseDown = (e: MouseEvent): void => {
	isMouseDown = true
	selectedRect = null
	mouseDownVector = null
	mouseOnXBorder = false

	// This won't work for Mobile events. But then again, neither will 'mouseDown'.
	// This also wont work for CSS modified or scrollable windows..
	const mouseX: number = e.offsetX
	const mouseY: number = e.offsetY

	rectangles?.forEach(rect => {
		if (isCursorOnRectBorder(mouseX, mouseY, rect)) {
			selectedRect = rect
			mouseDownVector = {x: mouseX, y: mouseY }
			mouseOnXBorder = true
			rect.isHighlighted = false
			console.log("mouse on border")
		} else if (isCursorWithinRect(mouseX, mouseY, rect) || (rect.notch &&  isCursorWithinRect(mouseX, mouseY, rect.notch))) {
			selectedRect = rect
			mouseDownVector = {x: mouseX, y: mouseY }
			rect.isHighlighted = true
		} else {
			rect.isHighlighted = false
		}
	})
	requestDraw()
}

const handleMouseMove = (e: MouseEvent): void => {
	if (!isMouseDown || !selectedRect || !mouseDownVector) return

	if (mouseOnXBorder) {
		const delta = (mouseDownVector.x - e.offsetX)
		selectedRect.x -= delta
		selectedRect.width += delta
	} else if (mouseOnYBorder){
		selectedRect.y = selectedRect.y - (mouseDownVector.y - e.offsetY)
	} else {
		selectedRect.x = selectedRect.x - (mouseDownVector.x - e.offsetX)
		selectedRect.y = selectedRect.y - (mouseDownVector.y - e.offsetY)
	}
	mouseDownVector.x = e.offsetX
	mouseDownVector.y = e.offsetY

	requestDraw()
}

const handleMouseUp = (): void => {
	isMouseDown = false
}

const handleMouseLeave = (): void => {
	isMouseDown = false
}

onMounted(() => {
	rectangles = canvasJson.rectangles
	lines = canvasJson.lines

	requestDraw()
})

</script> 
