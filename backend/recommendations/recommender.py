"""
Outfit recommendation engine for personalized suggestions.
"""
from outfits.models import Outfit
from measurements.models import Measurement
from predictions.models import FitResult
from measurements.body_shape import get_body_shape_recommendations


class OutfitRecommender:
    """Recommend outfits based on user preferences and fit history"""
    
    def __init__(self, user):
        self.user = user
        try:
            self.measurements = Measurement.objects.get(user=user)
        except Measurement.DoesNotExist:
            self.measurements = None
    
    def recommend_by_body_shape(self, limit=10):
        """
        Recommend outfits based on user's body shape.
        
        Returns:
            list: Recommended outfits with scores
        """
        if not self.measurements or not self.measurements.body_shape:
            return []
        
        # Get body shape recommendations
        shape_recs = get_body_shape_recommendations(self.measurements.body_shape)
        
        # Get all user outfits
        outfits = Outfit.objects.filter(user=self.user)
        
        recommendations = []
        for outfit in outfits:
            score = self._calculate_body_shape_score(outfit, shape_recs)
            if score > 50:  # Only recommend if score is decent
                recommendations.append({
                    'outfit': outfit,
                    'score': score,
                    'reason': f'Good match for your {self.measurements.body_shape} body shape'
                })
        
        # Sort by score
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:limit]
    
    def recommend_by_occasion(self, occasion, limit=10):
        """
        Recommend outfits for a specific occasion.
        
        Args:
            occasion: str - Occasion type (casual, formal, etc.)
            limit: int - Maximum number of recommendations
            
        Returns:
            list: Recommended outfits
        """
        # Get outfits for the occasion
        outfits = Outfit.objects.filter(
            user=self.user,
            occasion=occasion
        ).order_by('-times_worn', '-uploaded_at')
        
        # Get past fit results for scoring
        fit_results = {
            fr.outfit_id: fr.fit_score 
            for fr in FitResult.objects.filter(user=self.user)
        }
        
        recommendations = []
        for outfit in outfits[:limit]:
            score = fit_results.get(outfit.id, 75)  # Default score if no fit result
            recommendations.append({
                'outfit': outfit,
                'score': float(score),
                'reason': f'Great for {occasion} occasions'
            })
        
        return recommendations
    
    def recommend_by_season(self, season, limit=10):
        """
        Recommend outfits for a specific season.
        
        Args:
            season: str - Season (spring, summer, fall, winter)
            limit: int - Maximum number of recommendations
            
        Returns:
            list: Recommended outfits
        """
        # Get seasonal outfits
        outfits = Outfit.objects.filter(
            user=self.user
        ).filter(
            season__in=[season, 'all_season']
        ).order_by('-times_worn', '-uploaded_at')
        
        recommendations = []
        for outfit in outfits[:limit]:
            recommendations.append({
                'outfit': outfit,
                'score': 80,  # Base score for seasonal match
                'reason': f'Perfect for {season}'
            })
        
        return recommendations
    
    def recommend_similar(self, outfit_id, limit=5):
        """
        Find outfits similar to a specific outfit.
        
        Args:
            outfit_id: int - Outfit ID to find similar items for
            limit: int - Maximum number of similar outfits
            
        Returns:
            list: Similar outfits with similarity scores
        """
        try:
            reference_outfit = Outfit.objects.get(id=outfit_id, user=self.user)
        except Outfit.DoesNotExist:
            return []
        
        # Get all other outfits
        other_outfits = Outfit.objects.filter(user=self.user).exclude(id=outfit_id)
        
        similar = []
        for outfit in other_outfits:
            similarity = self._calculate_similarity(reference_outfit, outfit)
            if similarity > 0.3:  # Minimum similarity threshold
                similar.append({
                    'outfit': outfit,
                    'similarity_score': similarity,
                    'reason': self._get_similarity_reason(reference_outfit, outfit)
                })
        
        # Sort by similarity
        similar.sort(key=lambda x: x['similarity_score'], reverse=True)
        return similar[:limit]
    
    def get_best_fitting_outfits(self, limit=10):
        """
        Get outfits with best fit scores.
        
        Returns:
            list: Best fitting outfits
        """
        fit_results = FitResult.objects.filter(
            user=self.user,
            fit_status__in=['perfect', 'good']
        ).order_by('-fit_score')[:limit]
        
        recommendations = []
        for result in fit_results:
            recommendations.append({
                'outfit': result.outfit,
                'score': float(result.fit_score),
                'reason': f'Excellent fit ({result.fit_status})'
            })
        
        return recommendations
    
    def _calculate_body_shape_score(self, outfit, shape_recs):
        """Calculate how well an outfit matches body shape recommendations"""
        score = 70  # Base score
        
        # Boost score for matching colors/styles (simplified)
        if outfit.category in ['dress', 'full_outfit']:
            score += 10
        
        if outfit.is_favorite:
            score += 20
        
        return min(100, score)
    
    def _calculate_similarity(self, outfit1, outfit2):
        """
        Calculate similarity between two outfits.
        
        Returns:
            float: Similarity score (0-1)
        """
        similarity = 0.0
        factors = 0
        
        # Category match
        if outfit1.category == outfit2.category:
            similarity += 0.3
        factors += 1
        
        # Occasion match
        if outfit1.occasion and outfit2.occasion:
            if outfit1.occasion == outfit2.occasion:
                similarity += 0.2
            factors += 1
        
        # Color match
        if outfit1.color and outfit2.color:
            if outfit1.color.lower() == outfit2.color.lower():
                similarity += 0.2
            factors += 1
        
        # Season match
        if outfit1.season and outfit2.season:
            if outfit1.season == outfit2.season:
                similarity += 0.15
            factors += 1
        
        # Brand match
        if outfit1.brand and outfit2.brand:
            if outfit1.brand.lower() == outfit2.brand.lower():
                similarity += 0.15
            factors += 1
        
        return similarity
    
    def _get_similarity_reason(self, outfit1, outfit2):
        """Get human-readable reason for similarity"""
        reasons = []
        
        if outfit1.category == outfit2.category:
            reasons.append(f"Same category ({outfit1.get_category_display()})")
        
        if outfit1.occasion and outfit2.occasion and outfit1.occasion == outfit2.occasion:
            reasons.append(f"Same occasion ({outfit1.get_occasion_display()})")
        
        if outfit1.color and outfit2.color and outfit1.color.lower() == outfit2.color.lower():
            reasons.append(f"Same color ({outfit1.color})")
        
        if outfit1.brand and outfit2.brand and outfit1.brand.lower() == outfit2.brand.lower():
            reasons.append(f"Same brand ({outfit1.brand})")
        
        return ", ".join(reasons) if reasons else "Similar style"
