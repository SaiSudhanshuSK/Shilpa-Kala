dependencies {
    // CameraX core library using the camera2 implementation
    val camerax_version = "1.3.0-rc01"
    implementation("androidx.camera:camera-core:${camerax_version}")
    implementation("androidx.camera:camera-camera2:${camerax_version}")
    implementation("androidx.camera:camera-lifecycle:${camerax_version}")
    implementation("androidx.camera:camera-view:${camerax_version}")

    // Navigation
    implementation("androidx.navigation:navigation-compose:2.7.2")

    // Icons
    implementation("androidx.compose.material:material-icons-extended:1.5.1")
}
