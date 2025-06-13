# Start MongoDB (if not already running)
Write-Host "Starting MongoDB..."
Start-Process mongod

# Start the server
Write-Host "Starting the server..."
Set-Location server
Start-Process powershell -ArgumentList "npm start"

# Start the client
Write-Host "Starting the client..."
Set-Location ../client
Start-Process powershell -ArgumentList "npm start"

Write-Host "Both client and server are starting..."
Write-Host "Client will be available at: http://localhost:3000"
Write-Host "Server will be available at: http://localhost:5000" 