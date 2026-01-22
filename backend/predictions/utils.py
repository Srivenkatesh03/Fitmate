def calculate_fit_score(user_measurements, outfit_measurements):
    from decimal import Decimal
    """
    Simple rule-based fit calculation
    Returns: (fit_score, fit_status, recommendations)
    """
    
    score = Decimal('100.0')
    recommendations = []
    
    # Calculate differences
    chest_diff = abs(outfit_measurements.get('chest', 0) - user_measurements.get('chest', 0))
    waist_diff = abs(outfit_measurements.get('waist', 0) - user_measurements.get('waist', 0))
    hips_diff = abs(outfit_measurements.get('hips', 0) - user_measurements.get('hips', 0))
    
    # Deduct points based on differences
    if chest_diff > 5:
        score -= Decimal(chest_diff * 2)
        recommendations.append(f"Chest fit may be {'tight' if outfit_measurements.get('chest', 0) < user_measurements.get('chest', 0) else 'loose'}")
    
    if waist_diff > 5:
        score -= Decimal(waist_diff * 2)
        recommendations.append(f"Waist fit may be {'tight' if outfit_measurements.get('waist', 0) < user_measurements.get('waist', 0) else 'loose'}")
    
    if hips_diff > 5:
        score -= Decimal(hips_diff * 2)
        recommendations.append(f"Hip fit may be {'tight' if outfit_measurements.get('hips', 0) < user_measurements.get('hips', 0) else 'loose'}")
    
    # Ensure score is between 0-100
    score = max(Decimal('0.0'), min(Decimal('100.0'), score))
    
    # Determine fit status
    if score >= 90:
        fit_status = 'perfect'
    elif score >= 75:
        fit_status = 'good'
    elif score >= 50:
        fit_status = 'loose'
    else:
        fit_status = 'tight'
    
    if not recommendations:
        recommendations.append("Great fit! This outfit matches your measurements well.")
    
    return score, fit_status, "\n".join(recommendations)