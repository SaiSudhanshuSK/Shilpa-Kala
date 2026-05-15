package com.mindmatrix.shilpakala

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.*

// --- Theme Simulation ---
val Sandalwood = Color(0xFF3D2616)
val Gold = Color(0xFFC5A059)
val Parchment = Color(0xFFF5F2ED)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = lightColorScheme(
                    primary = Sandalwood,
                    secondary = Gold,
                    background = Parchment
                )
            ) {
                AppNavigation()
            }
        }
    }
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    var brandingName by remember { mutableStateOf("") }
    var woodType by remember { mutableStateOf("") }
    var price by remember { mutableStateOf("") }

    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(
                name = brandingName, onNameChange = { brandingName = it },
                wood = woodType, onWoodChange = { woodType = it },
                price = price, onPriceChange = { price = it },
                onStart = { navController.navigate("camera") }
            )
        }
        composable("camera") {
            CameraScreen(
                name = brandingName,
                wood = woodType,
                price = price,
                onBack = { navController.popBackStack() }
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    name: String, onNameChange: (String) -> Unit,
    wood: String, onWoodChange: (String) -> Unit,
    price: String, onPriceChange: (String) -> Unit,
    onStart: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Parchment)
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Logo Label
        Box(
            modifier = Modifier
                .size(width = 120.dp, height = 160.dp)
                .background(Sandalwood, RoundedCornerShape(topStart = 60.dp, topEnd = 60.dp, bottomStart = 60.dp, bottomEnd = 60.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text("SK", color = Gold, fontSize = 48.sp, fontWeight = FontWeight.Light)
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Text("Shilpa-Kala", color = Sandalwood, fontSize = 40.sp, fontWeight = FontWeight.Bold)
        Text("Digital Portfolio Assistant", color = Gold, fontSize = 12.sp, letterSpacing = 4.sp)
        
        Spacer(modifier = Modifier.height(48.dp))
        
        Surface(
            color = Color.White.copy(alpha = 0.5f),
            shape = RoundedCornerShape(32.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(24.dp)) {
                OutlinedTextField(
                    value = name, 
                    onValueChange = onNameChange, 
                    label = { Text("Artisan Name") }, 
                    modifier = Modifier.fillMaxWidth(),
                    colors = TextFieldDefaults.outlinedTextFieldColors(focusedBorderColor = Gold)
                )
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedTextField(
                    value = wood, 
                    onValueChange = onWoodChange, 
                    label = { Text("Material") }, 
                    modifier = Modifier.fillMaxWidth(),
                    colors = TextFieldDefaults.outlinedTextFieldColors(focusedBorderColor = Gold)
                )
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedTextField(
                    value = price, 
                    onValueChange = onPriceChange, 
                    label = { Text("Price (INR)") }, 
                    modifier = Modifier.fillMaxWidth(),
                    colors = TextFieldDefaults.outlinedTextFieldColors(focusedBorderColor = Gold)
                )
            }
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Button(
            onClick = onStart,
            modifier = Modifier
                .fillMaxWidth()
                .height(64.dp),
            shape = RoundedCornerShape(32.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Sandalwood)
        ) {
            Text("Begin Capture", color = Gold, fontWeight = FontWeight.Bold, letterSpacing = 2.sp)
        }
    }
}
