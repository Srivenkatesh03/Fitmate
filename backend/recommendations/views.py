from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from outfits.serializers import OutfitSerializer
from .recommender import OutfitRecommender


class RecommendedOutfitsView(APIView):
    """Get personalized outfit recommendations"""
    
    def get(self, request):
        recommender = OutfitRecommender(request.user)
        
        # Get query parameters
        occasion = request.query_params.get('occasion')
        season = request.query_params.get('season')
        limit = int(request.query_params.get('limit', 10))
        
        # Get recommendations based on parameters
        if occasion:
            recommendations = recommender.recommend_by_occasion(occasion, limit)
        elif season:
            recommendations = recommender.recommend_by_season(season, limit)
        else:
            # Default: recommend by body shape
            recommendations = recommender.recommend_by_body_shape(limit)
            
            # If no body shape recommendations, get best fitting outfits
            if not recommendations:
                recommendations = recommender.get_best_fitting_outfits(limit)
        
        # Serialize recommendations
        results = []
        for rec in recommendations:
            outfit_data = OutfitSerializer(rec['outfit']).data
            results.append({
                'outfit': outfit_data,
                'score': rec.get('score', rec.get('similarity_score', 0)),
                'reason': rec['reason']
            })
        
        return Response({'recommendations': results})


class SimilarOutfitsView(APIView):
    """Get outfits similar to a specific outfit"""
    
    def get(self, request, pk):
        recommender = OutfitRecommender(request.user)
        limit = int(request.query_params.get('limit', 5))
        
        similar_outfits = recommender.recommend_similar(pk, limit)
        
        # Serialize results
        results = []
        for item in similar_outfits:
            outfit_data = OutfitSerializer(item['outfit']).data
            results.append({
                'outfit': outfit_data,
                'similarity_score': item['similarity_score'],
                'reason': item['reason']
            })
        
        return Response({'similar_outfits': results})
