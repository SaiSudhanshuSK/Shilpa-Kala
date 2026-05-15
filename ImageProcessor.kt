package com.mindmatrix.shilpakala

import android.graphics.*
import android.text.TextPaint

object ImageProcessor {
    
    /**
     * Takes a raw photo and adds the "Shilpa-Kala" professional luxury branding.
     */
    fun applyBranding(
        original: Bitmap,
        artisanName: String,
        woodType: String,
        price: String
    ): Bitmap {
        val result = original.copy(Bitmap.Config.ARGB_8888, true)
        val canvas = Canvas(result)
        
        val colorSandalwood = Color.parseColor("#3D2616")
        val colorGold = Color.parseColor("#C5A059")

        // 1. Heritage Label (Top Left)
        val labelPaint = Paint().apply {
            color = Color.argb(230, 255, 255, 255)
            style = Paint.Style.FILL
        }
        canvas.drawRoundRect(40f, 40f, 550f, 180f, 30f, 30f, labelPaint)
        
        val textPaint = TextPaint().apply {
            color = colorSandalwood
            textSize = 34f
            isFakeBoldText = true
            isAntiAlias = true
        }
        canvas.drawText("Handmade in Karnataka", 60f, 100f, textPaint)
        textPaint.textSize = 26f
        textPaint.isFakeBoldText = false
        canvas.drawText("Heritage Artisan Guild", 60f, 145f, textPaint)

        // 2. Price Tag (Bottom Right)
        val tagPaint = Paint().apply {
            color = colorSandalwood
            alpha = 245
        }
        val tagWidth = 420f
        val tagHeight = 200f
        val tagLeft = result.width - tagWidth - 40f
        val tagTop = result.height - tagHeight - 40f
        canvas.drawRoundRect(tagLeft, tagTop, result.width - 40f, result.height - 40f, 32f, 32f, tagPaint)

        // Add a gold accent line in the price tag
        val accentPaint = Paint().apply {
            color = colorGold
            strokeWidth = 4f
        }
        canvas.drawLine(tagLeft + 30f, tagTop + 70f, tagLeft + 100f, tagTop + 70f, accentPaint)

        textPaint.color = colorGold
        textPaint.textSize = 28f
        canvas.drawText(artisanName.uppercase(), tagLeft + 30f, tagTop + 60f, textPaint)
        
        textPaint.color = Color.WHITE
        textPaint.textSize = 24f
        canvas.drawText(woodType, tagLeft + 30f, tagTop + 100f, textPaint)
        
        textPaint.color = colorGold
        textPaint.textSize = 44f
        textPaint.isFakeBoldText = true
        canvas.drawText("₹$price", tagLeft + 30f, tagTop + 165f, textPaint)

        return result
    }
}
