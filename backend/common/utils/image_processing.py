"""
Image processing utilities for Fitmate
Handles image compression, thumbnail generation, and validation
"""
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.exceptions import ValidationError
import os


ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB in bytes


def validate_image(image):
    """
    Validate image format, size, and dimensions
    
    Args:
        image: UploadedFile object
        
    Raises:
        ValidationError: If image is invalid
    """
    # Check file size
    if image.size > MAX_IMAGE_SIZE:
        raise ValidationError(f'Image file too large. Maximum size is 10MB.')
    
    # Check file type
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise ValidationError(
            f'Invalid image format. Allowed formats: JPEG, PNG, WebP'
        )
    
    # Try to open image to validate it's a real image
    try:
        img = Image.open(image)
        img.verify()
    except Exception:
        raise ValidationError('Invalid or corrupted image file.')
    
    return True


def compress_image(image, max_size=(1920, 1920), quality=85):
    """
    Compress and resize image to reduce file size
    
    Args:
        image: UploadedFile object or PIL Image
        max_size: Tuple of (width, height) for maximum dimensions
        quality: JPEG quality (1-100)
        
    Returns:
        InMemoryUploadedFile: Compressed image
    """
    # Open image
    if isinstance(image, Image.Image):
        img = image
        name = 'compressed.jpg'
    else:
        img = Image.open(image)
        name = image.name
    
    # Convert RGBA to RGB if necessary
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = background
    
    # Resize if larger than max_size
    img.thumbnail(max_size, Image.Resampling.LANCZOS)
    
    # Save to BytesIO
    output = BytesIO()
    img.save(output, format='JPEG', quality=quality, optimize=True)
    output.seek(0)
    
    # Create InMemoryUploadedFile
    return InMemoryUploadedFile(
        output,
        'ImageField',
        f'{os.path.splitext(name)[0]}.jpg',
        'image/jpeg',
        output.getbuffer().nbytes,
        None
    )


def create_thumbnail(image, size=(300, 300)):
    """
    Create a thumbnail from an image
    
    Args:
        image: UploadedFile object or PIL Image or file path
        size: Tuple of (width, height) for thumbnail
        
    Returns:
        InMemoryUploadedFile: Thumbnail image
    """
    # Open image
    if isinstance(image, Image.Image):
        img = image.copy()
        name = 'thumbnail.jpg'
    elif isinstance(image, str):
        img = Image.open(image)
        name = os.path.basename(image)
    else:
        img = Image.open(image)
        name = image.name
    
    # Convert RGBA to RGB if necessary
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = background
    
    # Create thumbnail
    img.thumbnail(size, Image.Resampling.LANCZOS)
    
    # Save to BytesIO
    output = BytesIO()
    img.save(output, format='JPEG', quality=85, optimize=True)
    output.seek(0)
    
    # Create InMemoryUploadedFile
    return InMemoryUploadedFile(
        output,
        'ImageField',
        f'thumb_{os.path.splitext(name)[0]}.jpg',
        'image/jpeg',
        output.getbuffer().nbytes,
        None
    )


def sanitize_filename(filename):
    """
    Sanitize filename to prevent security issues
    
    Args:
        filename: Original filename
        
    Returns:
        str: Sanitized filename
    """
    # Remove path components
    filename = os.path.basename(filename)
    
    # Remove potentially dangerous characters
    keepcharacters = (' ', '.', '_', '-')
    filename = "".join(c for c in filename if c.isalnum() or c in keepcharacters).rstrip()
    
    return filename
