#!/bin/bash

# GateRemoteSource Image Optimization Script
# 图片优化脚本

echo "🖼️  Starting image optimization..."

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install webp
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get install -y webp
    fi
fi

# Convert remaining JPG/PNG to WebP
echo "📸 Converting images to WebP..."

# Convert video poster
if [ -f "assets/videos/V1.3-poster.jpg" ]; then
    cwebp -q 85 assets/videos/V1.3-poster.jpg -o assets/videos/V1.3-poster.webp
    echo "✅ Converted V1.3-poster.jpg -> V1.3-poster.webp"
fi

# Convert logos (keep originals for compatibility)
if [ -f "logo/logo.png" ]; then
    cwebp -q 90 logo/logo.png -o logo/logo.webp
    echo "✅ Converted logo.png -> logo.webp"
fi

# Optimize existing WebP images (if needed)
echo "🔍 Checking existing WebP images..."

# Get file sizes
for img in assets/factory/*.webp; do
    size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
    size_kb=$((size / 1024))
    echo "  - $img: ${size_kb}KB"
done

echo "✨ Image optimization complete!"
echo ""
echo "📊 Summary:"
echo "  - Images converted to WebP"
echo "  - Original files kept for fallback"
echo "  - Quality setting: 85 for photos, 90 for logos"
