"""
Image processing utilities for Fitmate application.
Handles image compression, thumbnail generation, and validation.
"""
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.conf import settings
import sys
import os


def validate_image(image):
    """
    Validate image format and size.
    
    Args:
        image: Uploaded image file
        
    Returns:
        tuple: (is_valid, error_message)
    """
    # Check file size
    if image.size > settings.MAX_UPLOAD_SIZE:
        max_mb = settings.MAX_UPLOAD_SIZE / (1024 * 1024)
        return False, f"Image size exceeds maximum allowed size of {max_mb}MB"
    
    # Check content type
    if hasattr(image, 'content_type'):
        if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
            return False, f"Invalid image format. Allowed formats: JPEG, PNG, WebP"
    
    # Try to open and verify it's a valid image
    try:
        img = Image.open(image)
        img.verify()
        return True, None
    except Exception as e:
        return False, f"Invalid image file: {str(e)}"


def compress_image(image, max_size=(1920, 1920), quality=85):
    """
    Compress and resize image while maintaining aspect ratio.
    
    Args:
        image: Uploaded image file
        max_size: Maximum dimensions (width, height)
        quality: JPEG quality (1-100)
        
    Returns:
        InMemoryUploadedFile: Compressed image
    """
    try:
        # Open image
        img = Image.open(image)
        
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
        img_format = 'JPEG'
        img.save(output, format=img_format, quality=quality, optimize=True)
        output.seek(0)
        
        # Get filename and extension
        filename = os.path.splitext(image.name)[0]
        
        # Create InMemoryUploadedFile
        compressed_image = InMemoryUploadedFile(
            output,
            'ImageField',
            f"{filename}.jpg",
            'image/jpeg',
            sys.getsizeof(output),
            None
        )
        
        return compressed_image
    except Exception as e:
        raise Exception(f"Error compressing image: {str(e)}")


def create_thumbnail(image, size=(300, 300)):
    """
    Create a thumbnail from an image.
    
    Args:
        image: Image file or Image object
        size: Thumbnail size (width, height)
        
    Returns:
        InMemoryUploadedFile: Thumbnail image
    """
    try:
        # Open image if it's a file
        if hasattr(image, 'read'):
            img = Image.open(image)
            # Reset file pointer
            image.seek(0)
        else:
            img = image
        
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
        
        # Generate filename
        if hasattr(image, 'name'):
            filename = os.path.splitext(image.name)[0]
        else:
            filename = 'thumbnail'
        
        # Create InMemoryUploadedFile
        thumbnail = InMemoryUploadedFile(
            output,
            'ImageField',
            f"{filename}_thumb.jpg",
            'image/jpeg',
            sys.getsizeof(output),
            None
        )
        
        return thumbnail
    except Exception as e:
        raise Exception(f"Error creating thumbnail: {str(e)}")


def process_outfit_image(image):
    """
    Process an outfit image: validate, compress, and create thumbnail.
    
    Args:
        image: Uploaded image file
        
    Returns:
        tuple: (compressed_image, thumbnail, error_message)
    """
    # Validate image
    is_valid, error = validate_image(image)
    if not is_valid:
        return None, None, error
    
    try:
        # Compress main image
        compressed = compress_image(image, max_size=(1920, 1920), quality=85)
        
        # Reset image pointer
        image.seek(0)
        
        # Create thumbnail
        thumbnail = create_thumbnail(image, size=(300, 300))
        
        return compressed, thumbnail, None
    except Exception as e:
        return None, None, str(e)
