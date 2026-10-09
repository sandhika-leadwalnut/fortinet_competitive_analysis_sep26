#!/bin/bash

# List of slides that need updating (excluding already updated ones)
SLIDES=(
  "slide-backlink-divider"
  "slide-intel-divider"  
  "slide-ngfw"
  "slide-sdwan-metrics"
  "slide-ot-security"
  "slide-dashboard"
  "slide-zero-trust"
  "slide-cloud-security"
  "slide-profund-metrics"
  "slide-ai-overview"
  "slide-category-performance"
  "slide-backlinks"
  "slide-competitive-intel"
  "slide-keyword-gap"
  "slide-thank-you"
)

echo "Slides to update: ${#SLIDES[@]}"
for slide in "${SLIDES[@]}"; do
  echo "- $slide"
done
