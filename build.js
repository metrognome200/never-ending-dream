const fs = require('fs');
const path = require('path');

console.log('🚀 Building Never Ending Dream for Vercel...');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Copy frontend files to public directory
const frontendDir = path.join(__dirname, 'frontend');
const copyRecursive = (src, dest) => {
    if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

if (fs.existsSync(frontendDir)) {
    console.log('📁 Copying frontend files to public directory...');
    copyRecursive(frontendDir, publicDir);
    console.log('✅ Frontend files copied successfully');
} else {
    console.log('⚠️ Frontend directory not found, creating minimal public directory');
    // Create a minimal index.html if frontend doesn't exist
    const minimalHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Never Ending Dream</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Never Ending Dream</h1>
    <p>Game is being deployed...</p>
</body>
</html>`;
    fs.writeFileSync(path.join(publicDir, 'index.html'), minimalHtml);
}

// Copy backend files to api directory
const apiDir = path.join(__dirname, 'api');
if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
}

const backendDir = path.join(__dirname, 'backend');
if (fs.existsSync(backendDir)) {
    console.log('📁 Copying backend files to api directory...');
    copyRecursive(backendDir, apiDir);
    console.log('✅ Backend files copied successfully');
}

console.log('🎉 Build completed successfully!');
console.log('📂 Public directory created at:', publicDir);
console.log('📂 API directory created at:', apiDir); 