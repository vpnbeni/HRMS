# Create necessary directories if they don't exist
Write-Host "Creating directories..."
New-Item -ItemType Directory -Force -Path "client/public"
New-Item -ItemType Directory -Force -Path "client/src/components"
New-Item -ItemType Directory -Force -Path "client/src/pages"
New-Item -ItemType Directory -Force -Path "client/src/context"
New-Item -ItemType Directory -Force -Path "client/src/utils"
New-Item -ItemType Directory -Force -Path "client/src/assets"
New-Item -ItemType Directory -Force -Path "client/src/styles"

# Install server dependencies
Write-Host "Installing server dependencies..."
Set-Location server
npm install
Set-Location ..

# Install client dependencies
Write-Host "Installing client dependencies..."
Set-Location client
npm install
Set-Location ..

Write-Host "Setup complete! You can now start the application using start.ps1" 