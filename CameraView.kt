package com.mindmatrix.shilpakala

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import androidx.camera.view.PreviewView
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.viewinterop.AndroidView

@Composable
fun CameraScreen(name: String, wood: String, price: String, onBack: () -> Unit) {
    Box(modifier = Modifier.fillMaxSize()) {
        // Camera Preview using CameraX
        AndroidView(
            factory = { context ->
                PreviewView(context).apply {
                    // Logic to bind CameraX lifecycle goes here
                }
            },
            modifier = Modifier.fillMaxSize()
        )

        // Guided Overlay (The Outline)
        Canvas(modifier = Modifier.fillMaxSize()) {
            val strokeWidth = 2f
            val guideWidth = size.width * 0.85f
            val guideHeight = guideWidth * 1.33f
            val left = (size.width - guideWidth) / 2
            val top = (size.height - guideHeight) / 2
            val goldColor = androidx.compose.ui.graphics.Color(0xFFC5A059)

            // Draw the guide box with a subtle gold tint
            drawRect(
                color = goldColor.copy(alpha = 0.3f),
                topLeft = Offset(left, top),
                size = Size(guideWidth, guideHeight),
                style = Stroke(width = strokeWidth)
            )
            
            // Refined Golden Corners
            val cornerLen = 60f
            val cornerStroke = 6f
            
            // Top Left
            drawLine(goldColor, Offset(left, top), Offset(left + cornerLen, top), cornerStroke)
            drawLine(goldColor, Offset(left, top), Offset(left, top + cornerLen), cornerStroke)

            // Bottom Right
            drawLine(goldColor, Offset(left + guideWidth, top + guideHeight), Offset(left + guideWidth - cornerLen, top + guideHeight), cornerStroke)
            drawLine(goldColor, Offset(left + guideWidth, top + guideHeight), Offset(left + guideWidth, top + guideHeight - cornerLen), cornerStroke)
        }
    }
}
