"""
Body shape detection utilities based on body measurements.
"""


def detect_body_shape(measurements):
    """
    Auto-detect body shape from measurements.
    
    Args:
        measurements: Dictionary or object with chest, waist, hips, shoulder measurements
        
    Returns:
        str: Body shape (rectangle, triangle, inverted_triangle, hourglass, or oval)
    """
    # Extract measurements
    if isinstance(measurements, dict):
        chest = float(measurements.get('chest', 0))
        waist = float(measurements.get('waist', 0))
        hips = float(measurements.get('hips', 0))
        shoulder = float(measurements.get('shoulder', 0))
    else:
        chest = float(getattr(measurements, 'chest', 0) or 0)
        waist = float(getattr(measurements, 'waist', 0) or 0)
        hips = float(getattr(measurements, 'hips', 0) or 0)
        shoulder = float(getattr(measurements, 'shoulder', 0) or 0)
    
    # Return None if required measurements are missing
    if not all([chest, waist, hips]):
        return None
    
    # Calculate ratios and differences
    bust_hip_diff = abs(chest - hips)
    waist_hip_diff = hips - waist
    waist_bust_diff = chest - waist
    
    # Hourglass: Bust and hips are nearly equal, waist is notably smaller
    if bust_hip_diff <= 2.5 and waist_hip_diff >= 18 and waist_bust_diff >= 18:
        return 'hourglass'
    
    # Triangle (Pear): Hips are larger than bust
    if hips - chest >= 5 and waist_hip_diff >= 18:
        return 'triangle'
    
    # Inverted Triangle: Bust/shoulders are larger than hips
    if chest - hips >= 9 or (shoulder and shoulder - hips >= 5):
        return 'inverted_triangle'
    
    # Oval (Apple): Waist is larger than bust and hips, or close to them
    if waist >= chest - 2.5 or waist >= hips - 2.5:
        return 'oval'
    
    # Rectangle: Bust, waist, and hips are roughly the same
    if bust_hip_diff <= 2.5 and waist_hip_diff < 18 and waist_bust_diff < 18:
        return 'rectangle'
    
    # Default to rectangle if no clear pattern
    return 'rectangle'


def get_body_shape_recommendations(body_shape):
    """
    Get style recommendations based on body shape.
    
    Args:
        body_shape: str - Body shape type
        
    Returns:
        dict: Recommendations for the body shape
    """
    recommendations = {
        'hourglass': {
            'description': 'Balanced proportions with defined waist',
            'best_styles': [
                'Fitted and tailored pieces',
                'Wrap dresses',
                'High-waisted bottoms',
                'V-necklines',
                'Belted styles'
            ],
            'avoid': [
                'Shapeless or boxy clothing',
                'Too loose or oversized fits'
            ]
        },
        'triangle': {
            'description': 'Hips wider than shoulders',
            'best_styles': [
                'A-line skirts and dresses',
                'Wide-leg pants',
                'Boat neck tops',
                'Embellished or detailed tops',
                'Dark colored bottoms'
            ],
            'avoid': [
                'Skinny jeans',
                'Tapered pants',
                'Hip pockets'
            ]
        },
        'inverted_triangle': {
            'description': 'Shoulders wider than hips',
            'best_styles': [
                'V-neck tops',
                'A-line skirts',
                'Bootcut or wide-leg pants',
                'Detailed bottoms',
                'Dark tops with light bottoms'
            ],
            'avoid': [
                'Shoulder pads',
                'Boat necks',
                'Skinny pants without balance on top'
            ]
        },
        'rectangle': {
            'description': 'Straight silhouette with minimal waist definition',
            'best_styles': [
                'Peplum tops',
                'Belted dresses',
                'Layered clothing',
                'Ruffles and details',
                'Curved hemlines'
            ],
            'avoid': [
                'Straight, shapeless dresses',
                'Too boxy styles'
            ]
        },
        'oval': {
            'description': 'Rounded middle with slimmer legs',
            'best_styles': [
                'Empire waist dresses',
                'V-neck tops',
                'Flowing fabrics',
                'Structured jackets',
                'Monochromatic outfits'
            ],
            'avoid': [
                'Tight fitted clothing',
                'Horizontal stripes',
                'Clingy fabrics'
            ]
        }
    }
    
    return recommendations.get(body_shape, {})
