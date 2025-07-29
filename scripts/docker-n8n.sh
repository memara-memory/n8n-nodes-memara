#!/bin/bash

# Memara n8n Node Development Script
# Usage: ./scripts/docker-n8n.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Check if docker-compose is available
check_docker() {
    if ! command -v docker-compose &> /dev/null; then
        error "docker-compose is required but not installed"
    fi
}

# Build and start development environment
start_dev() {
    log "Starting Memara n8n development environment..."
    docker-compose -f docker-compose.n8n.yml up -d memara-n8n-dev
    log "Development environment started!"
    log "Access at: http://localhost:5678 (admin/admin)"
}

# Start testing environment
start_test() {
    log "Starting n8n test instance..."
    docker-compose -f docker-compose.n8n.yml up -d n8n-test
    log "Test instance started!"
    log "Access at: http://localhost:5679 (admin/admin)"
}

# Start both environments
start_all() {
    log "Starting all services..."
    docker-compose -f docker-compose.n8n.yml up -d
    log "All services started!"
    log "Development: http://localhost:5678 (admin/admin)"
    log "Testing: http://localhost:5679 (admin/admin)"
}

# Stop services
stop() {
    log "Stopping all services..."
    docker-compose -f docker-compose.n8n.yml down
    log "All services stopped!"
}

# Show logs
logs() {
    local service=${1:-}
    if [ -n "$service" ]; then
        docker-compose -f docker-compose.n8n.yml logs -f "$service"
    else
        docker-compose -f docker-compose.n8n.yml logs -f
    fi
}

# Build the node
build() {
    log "Building Memara n8n node..."
    docker-compose -f docker-compose.n8n.yml exec memara-n8n-dev npm run build
    log "Build completed!"
}

# Run linting
lint() {
    log "Running linter..."
    docker-compose -f docker-compose.n8n.yml exec memara-n8n-dev npm run lint
}

# Run tests
test() {
    log "Running tests..."
    docker-compose -f docker-compose.n8n.yml exec memara-n8n-dev npm test
}

# Show status
status() {
    log "Service status:"
    docker-compose -f docker-compose.n8n.yml ps
}

# Clean up everything
clean() {
    warn "This will remove all containers and volumes. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        docker-compose -f docker-compose.n8n.yml down -v --remove-orphans
        docker system prune -f
        log "Cleanup completed!"
    else
        log "Cleanup cancelled."
    fi
}

# Execute command in development container
exec_dev() {
    if [ $# -eq 0 ]; then
        docker-compose -f docker-compose.n8n.yml exec memara-n8n-dev sh
    else
        docker-compose -f docker-compose.n8n.yml exec memara-n8n-dev "$@"
    fi
}

# Show help
show_help() {
    cat << EOF
Memara n8n Node Development Script

Usage: $0 [command]

Commands:
    dev         Start development environment only
    test        Start test n8n instance only  
    start       Start all services
    stop        Stop all services
    build       Build the node package
    lint        Run linter
    test        Run tests
    logs [svc]  Show logs (optionally for specific service)
    status      Show service status
    exec [cmd]  Execute command in dev container (or start shell)
    clean       Clean up all containers and volumes
    help        Show this help message

Examples:
    $0 start                    # Start all services
    $0 logs memara-n8n-dev     # Show dev container logs
    $0 exec npm run build      # Build inside container
    $0 exec                    # Start shell in container

Access URLs:
    Development: http://localhost:5678 (admin/admin)
    Testing:     http://localhost:5679 (admin/admin)
EOF
}

# Main script logic
main() {
    check_docker
    
    case "${1:-help}" in
        "dev")
            start_dev
            ;;
        "test")
            start_test
            ;;
        "start")
            start_all
            ;;
        "stop")
            stop
            ;;
        "build")
            build
            ;;
        "lint")
            lint
            ;;
        "logs")
            logs "$2"
            ;;
        "status")
            status
            ;;
        "exec")
            shift
            exec_dev "$@"
            ;;
        "clean")
            clean
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            error "Unknown command: $1. Use '$0 help' for usage information."
            ;;
    esac
}

main "$@" 