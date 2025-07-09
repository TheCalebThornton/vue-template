<template>
  <div class="home">
    <h1 class="text-3xl font-bold text-primary-600 mb-6">Voxel Demo App</h1>
    <div class="flex flex-col items-center">
			<canvas
				ref="mainCanvas"
				class="border" 
				:width=canvasWidth
				:height=canvasHeight
			/>
		</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef, computed } from 'vue';

/** Art styles/ACs 
 * RNG
 * Draw RNG lines (full canvas)
 * Draw filled Rectangles RNG starts (yellow, red, blue)
 */

type Rectangle = {
	x: number,
	y: number,
	width: number,
	height: number,
	color: string
}

type Line = {
	x: number,
	y: number,
	endX: number,
	endY: number
}

const mainCanvas = useTemplateRef('mainCanvas')
const COLORS = ['rgb(255,0,0)', 'rgb(255,255,0)', 'rgb(0,0,255)']

let linesVertical: Line[] = []
let linesHorizontal: Line[] = []
let segmentsVertical: Line[] = []
let segmentsHorizontal: Line[] = []
let rectangles: Rectangle[] = []

const canvasWidth = computed((): number => {
	return 600
})

const canvasHeight = computed((): number => {
	return 600
})

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const drawRandomRectangles = (context: CanvasRenderingContext2D): void => {
	const generateRandomRectangle = (): Rectangle => {
		return {
			x: getRandomInt(0, canvasWidth.value),
			y: getRandomInt(0, canvasHeight.value),
			width: getRandomInt(10, 100),
			height: getRandomInt(10, 100),
			color: COLORS[getRandomInt(0,2)]
		}
	}

	const nRectangles = getRandomInt(1, 5)
	for(let i=0;i<=nRectangles;i++) {
		rectangles.push(generateRandomRectangle())
	}

	rectangles.forEach((rect: Rectangle) => {
		context.lineWidth = 4
		context.fillStyle = rect.color
		context.fillRect(rect.x, rect.y, rect.width, rect.height)
	})
}

const drawRandomLines = (context: CanvasRenderingContext2D): void => {
	// TODO how to make vertical AND horizontal lines
	const generateRandomHorizontalLine = (): Line => {
		const rngY = getRandomInt(0, canvasHeight.value)
		return {
			x: 0,
			y: rngY,
			endX: canvasWidth.value,
			endY: rngY,
		}
	}
	
	const generateRandomVerticalLine = (): Line => {
		const rngX = getRandomInt(0, canvasWidth.value)
		return {
			x: rngX,
			y: 0,
			endX: rngX,
			endY: canvasHeight.value,
		}
	}

	const generateRandomVeritcalSegment = (): Line => {
		const rngStartIndex = getRandomInt(0, linesHorizontal.length -1)
		const rngEndIndex = getRandomInt(0, linesHorizontal.length -1)
		const segX = getRandomInt(linesHorizontal[rngStartIndex].x, linesHorizontal[rngStartIndex].endX)
		return {
			x: segX,
			y: linesHorizontal[rngStartIndex].y,
			endX: segX,
			endY: linesHorizontal[rngEndIndex].y,
		}
	}

	const generateRandomHorizontalSegment = (): Line => {
		const rngStartIndex = getRandomInt(0, linesVertical.length -1)
		const rngEndIndex = getRandomInt(0, linesVertical.length -1)
		const segY = getRandomInt(linesVertical[rngStartIndex].y, linesVertical[rngStartIndex].endY)
		return {
			x: linesVertical[rngStartIndex].x,
			y: segY,
			endX: linesVertical[rngEndIndex].x,
			endY: segY
		}
	}

	const nhLines = getRandomInt(1, 5)
	for(let i=0;i<=nhLines;i++) {
		linesHorizontal.push(generateRandomHorizontalLine())
	}
	const nvLines = getRandomInt(1, 5)
	for(let i=0;i<=nvLines;i++) {
		linesVertical.push(generateRandomVerticalLine())
	}
	const nvSegments = getRandomInt(1,3)
	for(let i=0;i<=nvSegments;i++) {
		segmentsVertical.push(generateRandomVeritcalSegment())
	}

	const nhSegments = getRandomInt(1,3)
	for(let i=0;i<=nhSegments;i++) {
		segmentsHorizontal.push(generateRandomHorizontalSegment())
	}

	[...linesHorizontal, ...linesVertical, ...segmentsVertical, ...segmentsHorizontal].forEach((line: Line) => {
		context.lineWidth = 4
		context.strokeStyle = "rgb(0,0,0)"
		context.beginPath()
		context.moveTo(line.x, line.y)
		context.lineTo(line.endX, line.endY)
		context.stroke()
		context.closePath()
	})
}

const requestDraw = (): void => {
	const ctx = mainCanvas.value?.getContext('2d')
	if (!ctx) {
		console.error('requestDraw: unable to get canvas context')
		return
	}
	 
	// NOTE call order matter so that rectangles are drawn behind the lines
	drawRandomRectangles(ctx)
	drawRandomLines(ctx)
}

onMounted(() =>{
	requestDraw()
})
</script> 