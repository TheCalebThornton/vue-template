<template>
  <div class="flex flex-col items-center w-full">
    <h1 class="text-3xl font-bold text-primary-600 mb-6">Canvas Demo</h1>
    
    <div class="flex flex-col gap-y-2">
			<h2 class="text-center">{{mode == CANVAS_MODES.draw ? 'Draw Mode!' : 'Select Mode!'}}</h2>
			<canvas 
				ref="myCanvas"
				class="border"
				width=600
				height=600
				@mousedown="handleCanvasMouseDown"
				@mouseup="handleCanvasMouseUp"
				@mousemove="handleCanvasMouseMove"
				@mouseleave="handleCanvasMouseLeave"
			/>
			<div class="flex flex-row gap-x-2 items-stretch">
				<button 
					class="flex-grow bg-primary-500 p-2 rounded"
					@click="handleClearClick"
				>
					Clear
				</button>
				<button 
					class="flex-grow bg-primary-500 p-2 rounded"
					@click="handleModeClick"
				>
					{{mode == CANVAS_MODES.draw ? "Enter 'Select' mode" : "Enter 'Draw' mode"}}
				</button>
			</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO TASKS:
// 1. Select rectangles -/
// 2. Move selected rectangles
// 3. Highlist selected rectangles -/
// 4. Add a 'notch' to the rectangles

import { onMounted, useTemplateRef, ref } from 'vue';

const CANVAS_MODES = {
	draw: 'DRAW',
	select: 'SELECT',
} as const
type CanvasMode = (typeof CANVAS_MODES)[keyof typeof CANVAS_MODES]
type Vector = {x: number, y: number}
type Rectangle = {id: number, x: number, y: number, width: number, height: number, color: string}

const myCanvas = useTemplateRef('myCanvas')
const DEFAULT_COLOR = "rgb(6, 36, 48)"
const HIGHLIGHT_COLOR = "rgb(229, 255, 0)"

let mode = ref(<CanvasMode>CANVAS_MODES.draw)
let isMousePressed = <boolean> false
let initialDrawPress: Vector | null = null
let rectangles = <Rectangle[]> []
let tempTangles: Rectangle[] = []
let selectedRectangle: Rectangle | null = null
let animationFrameId: number | null = null

const getNextRectangleId = (rect_list: Rectangle[]): number => {
	if (rect_list.length === 0) return 0
	return rect_list[rect_list.length-1].id + 1
}

const handleClearClick = (): void => {
	rectangles = []
	initialDrawPress = null
	const ctx = myCanvas.value?.getContext("2d");
	if (!ctx) return

	ctx.clearRect(0,0, (myCanvas.value?.width || 0), (myCanvas.value?.height || 0))
}

const handleModeClick = (): void => {
	if (mode.value === CANVAS_MODES.draw){
		mode.value = CANVAS_MODES.select
	} else {
		mode.value = CANVAS_MODES.draw
	}
}

const scheduleRedraw = (): void => {
	const redrawCanvas = (): void => {
		const ctx = myCanvas.value?.getContext("2d");
		if (!ctx) {
			console.error("redrawCanvas: Unable to find canvas context")
			return
		}
	
		ctx.clearRect(0,0, (myCanvas.value?.width || 0), (myCanvas.value?.height || 0))
		ctx.lineWidth = 4
		rectangles.forEach(rect  => {
			ctx.strokeStyle = rect.color;
			ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
		})
	
		tempTangles.forEach(trect => {
			ctx.strokeStyle = trect.color;
			ctx.strokeRect(trect.x, trect.y, trect.width, trect.height)
		})
	}

	if (animationFrameId) {
		cancelAnimationFrame(animationFrameId)
	}
	animationFrameId = requestAnimationFrame(() => {
		redrawCanvas()
		animationFrameId = null
	})
}

const highlightSelectedRectangle = (): void => {
	if (!selectedRectangle) return

	rectangles.forEach(rect  => {
		if (rect.id === selectedRectangle?.id) {
			rect.color = HIGHLIGHT_COLOR;
		} else {
			rect.color = DEFAULT_COLOR;
		}
	})

	scheduleRedraw()
}

const handleCanvasMouseDown = (e: MouseEvent) => {
	switch (mode.value){
		case CANVAS_MODES.draw:
			isMousePressed = true
			initialDrawPress = {x: e.offsetX, y: e.offsetY}
			break
		case CANVAS_MODES.select:
			isMousePressed = true
			
			const firstRect = rectangles.find(rect => {
				if ((rect.x <= e.offsetX && e.offsetX <= rect.x + rect.width || rect.x >= e.offsetX && e.offsetX >= rect.x + rect.width) && 
					(rect.y <= e.offsetY && e.offsetY <= rect.y + rect.height || rect.y >= e.offsetY && e.offsetY >= rect.y + rect.height) ) {
						console.log(`Curor within Rectangle ${rect.id}`)
						return true
					}
			})
			if (firstRect) {
				selectedRectangle = firstRect
				highlightSelectedRectangle()
			}
			break
		default:
			console.log('mode not caught')
	}
}

const handleCanvasMouseUp = (e: MouseEvent) => {
	isMousePressed = false
	const ctx = myCanvas.value?.getContext("2d");
	if (!ctx) {
		console.error("handleCanvasMouseUp: Unable to find canvas context")
		return
	}

	switch (mode.value){
		case CANVAS_MODES.draw:
			tempTangles = []
			if (initialDrawPress === null) return
			// negative deltas are ok here
			const xDelta = e.offsetX - initialDrawPress.x
			const yDelta = e.offsetY - initialDrawPress.y

			if (xDelta === 0 || yDelta === 0) return
			
			ctx.lineWidth = 4
			ctx.strokeStyle = DEFAULT_COLOR;
			rectangles.push({
				id: getNextRectangleId(rectangles),
				x: initialDrawPress.x,
				y: initialDrawPress.y,
				width: xDelta,
				height: yDelta,
				color: ctx.strokeStyle
			})
			// ctx.strokeRect(initialDrawPress.x, initialDrawPress.y, xDelta, yDelta)
			// This is technically not needed... slightly under preformant
			initialDrawPress = null
			scheduleRedraw()
			break
		case CANVAS_MODES.select:
			// console.log("select mode")
			break
		default:
			console.log('mode not caught')
	}
}

const handleCanvasMouseMove = (e: MouseEvent) => {
	const ctx = myCanvas.value?.getContext("2d");
	if (!ctx) {
		console.error("handleCanvasMouseMove: Unable to find canvas context")
		return
	}

	switch (mode.value){
		case CANVAS_MODES.draw:
			if (!isMousePressed || !initialDrawPress) return
				const xDelta = e.offsetX - initialDrawPress.x
				const yDelta = e.offsetY - initialDrawPress.y
	
				if (xDelta === 0 || yDelta === 0) return
				
				ctx.lineWidth = 4
				ctx.strokeStyle = DEFAULT_COLOR;
				tempTangles = []
				tempTangles.push({
					id: getNextRectangleId(tempTangles),
					x: initialDrawPress.x,
					y: initialDrawPress.y,
					width: xDelta,
					height: yDelta,
					color: ctx.strokeStyle
				})
				scheduleRedraw()
			break
		case CANVAS_MODES.select:
			// console.log("select mode")
			break
		default:
			// console.log('mode not caught')
	}
}

const handleCanvasMouseLeave = (e: MouseEvent) => {
	if (isMousePressed) handleCanvasMouseUp(e)
}

onMounted(() => {
	// TODO Draw rectangles
})

</script> 