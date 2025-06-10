#!/bin/bash

# Never Ending Dream - Deployment Script
# This script helps set up and deploy the game

set -e

echo "🌲 Never Ending Dream - Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[HEADER]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_status "Node.js version: $(node -v)"
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    # Install root dependencies
    if [ -f "package.json" ]; then
        print_status "Installing root dependencies..."
        npm install
    fi
    
    # Install backend dependencies
    if [ -d "backend" ]; then
        print_status "Installing backend dependencies..."
        cd backend
        npm install
        cd ..
    fi
    
    print_status "Dependencies installed successfully!"
}

# Setup environment
setup_environment() {
    print_header "Setting Up Environment"
    
    # Create backend .env file if it doesn't exist
    if [ ! -f "backend/.env" ]; then
        print_status "Creating backend .env file..."
        cp backend/env.example backend/.env
        print_warning "Please edit backend/.env with your actual configuration values"
    else
        print_status "Backend .env file already exists"
    fi
    
    # Create necessary directories
    print_status "Creating necessary directories..."
    mkdir -p backend/userStates
    mkdir -p backend/logs
    mkdir -p frontend/assets/sounds
    mkdir -p frontend/assets/images
    
    print_status "Environment setup complete!"
}

# Start development servers
start_dev() {
    print_header "Starting Development Servers"
    
    # Start backend server
    print_status "Starting backend server on port 3000..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend server
    print_status "Starting frontend server on port 8080..."
    cd frontend
    npx serve -p 8080 &
    FRONTEND_PID=$!
    cd ..
    
    print_status "Development servers started!"
    print_status "Backend: http://localhost:3000"
    print_status "Frontend: http://localhost:8080"
    print_status "Health check: http://localhost:3000/health"
    
    # Wait for user to stop servers
    echo ""
    print_warning "Press Ctrl+C to stop the servers"
    wait
}

# Build for production
build_production() {
    print_header "Building for Production"
    
    # Create production build directory
    mkdir -p dist
    
    # Copy backend files
    print_status "Copying backend files..."
    cp -r backend dist/
    rm -rf dist/backend/node_modules
    rm -rf dist/backend/userStates
    rm -rf dist/backend/logs
    
    # Copy frontend files
    print_status "Copying frontend files..."
    cp -r frontend dist/
    
    # Copy configuration files
    cp package.json dist/
    cp README.md dist/
    cp .gitignore dist/
    
    print_status "Production build complete in dist/ directory"
}

# Deploy to Heroku
deploy_heroku() {
    print_header "Deploying to Heroku"
    
    if ! command -v heroku &> /dev/null; then
        print_error "Heroku CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if Heroku app exists
    if ! heroku apps:info &> /dev/null; then
        print_status "Creating new Heroku app..."
        heroku create
    fi
    
    # Set environment variables
    print_status "Setting environment variables..."
    heroku config:set NODE_ENV=production
    
    # Deploy
    print_status "Deploying to Heroku..."
    git push heroku main
    
    print_status "Deployment complete!"
    print_status "App URL: $(heroku info -s | grep web_url | cut -d= -f2)"
}

# Deploy to Vercel
deploy_vercel() {
    print_header "Deploying to Vercel"
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Please install it first."
        exit 1
    fi
    
    print_status "Deploying to Vercel..."
    vercel --prod
    
    print_status "Deployment complete!"
}

# Run tests
run_tests() {
    print_header "Running Tests"
    
    # Backend tests
    if [ -d "backend" ]; then
        print_status "Running backend tests..."
        cd backend
        if [ -f "package.json" ] && grep -q "test" package.json; then
            npm test
        else
            print_warning "No test script found in backend"
        fi
        cd ..
    fi
    
    # Frontend tests
    if [ -d "frontend" ]; then
        print_status "Running frontend tests..."
        cd frontend
        if [ -f "package.json" ] && grep -q "test" package.json; then
            npm test
        else
            print_warning "No test script found in frontend"
        fi
        cd ..
    fi
    
    print_status "Tests completed!"
}

# Clean up
cleanup() {
    print_header "Cleaning Up"
    
    # Remove node_modules
    print_status "Removing node_modules..."
    find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
    
    # Remove build artifacts
    print_status "Removing build artifacts..."
    rm -rf dist/
    rm -rf build/
    rm -rf .next/
    rm -rf .nuxt/
    
    # Remove logs
    print_status "Removing logs..."
    find . -name "*.log" -delete
    
    print_status "Cleanup complete!"
}

# Show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install     Install dependencies"
    echo "  setup       Setup environment and directories"
    echo "  dev         Start development servers"
    echo "  build       Build for production"
    echo "  deploy      Deploy to production (Heroku)"
    echo "  vercel      Deploy to Vercel"
    echo "  test        Run tests"
    echo "  clean       Clean up build artifacts and dependencies"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install setup dev    # Full development setup"
    echo "  $0 build deploy         # Build and deploy"
    echo "  $0 clean                # Clean everything"
}

# Main script logic
case "${1:-help}" in
    "install")
        check_node
        install_dependencies
        ;;
    "setup")
        setup_environment
        ;;
    "dev")
        check_node
        install_dependencies
        setup_environment
        start_dev
        ;;
    "build")
        build_production
        ;;
    "deploy")
        deploy_heroku
        ;;
    "vercel")
        deploy_vercel
        ;;
    "test")
        run_tests
        ;;
    "clean")
        cleanup
        ;;
    "help"|*)
        show_help
        ;;
esac 