#!/usr/bin/env python3

import re
import os

# List of slides that need updating
slides = [
    "slide-intel-divider",
    "slide-ngfw",
    "slide-sdwan-metrics",
    "slide-ot-security",
    "slide-dashboard",
    "slide-zero-trust",
    "slide-cloud-security",
    "slide-profund-metrics",
    "slide-ai-overview",
    "slide-category-performance",
    "slide-backlinks",
    "slide-competitive-intel",
    "slide-keyword-gap",
    "slide-thank-you"
]

base_path = "/root/src/app/components/presentation"

for slide in slides:
    filepath = f"{base_path}/{slide}.tsx"
    
    if not os.path.exists(filepath):
        print(f"Skipping {slide} - file not found")
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Convert slide name to CamelCase
    component_name = ''.join(word.capitalize() for word in slide.split('-'))
    
    # Check if interface already exists
    if f"interface {component_name}Props" not in content:
        # Add interface before export function
        pattern = rf"(export function {component_name}\(\))"
        replacement = f"interface {component_name}Props {{\n  onNavigateHome?: () => void;\n}}\n\n\\1"
        content = re.sub(pattern, replacement, content)
        
        # Update function signature
        pattern = rf"export function {component_name}\(\)"
        replacement = f"export function {component_name}({{ onNavigateHome }}: {component_name}Props)"
        content = re.sub(pattern, replacement, content)
    
    # Update SlideContainer calls to include onNavigateHome
    pattern = r"<SlideContainer slideNumber={(\d+)}>"
    replacement = r"<SlideContainer slideNumber={\1} onNavigateHome={onNavigateHome}>"
    content = re.sub(pattern, replacement, content)
    
    # For slides without slideNumber
    pattern = r"<SlideContainer>"
    replacement = r"<SlideContainer onNavigateHome={onNavigateHome}>"
    content = re.sub(pattern, replacement, content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Updated {slide}")

print("Done!")
