"""
Machine Learning based fit prediction for Fitmate.
This module provides ML-powered outfit fit predictions.
"""
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os
from django.conf import settings


class FitPredictor:
    """
    Machine Learning based fit predictor using Random Forest.
    Falls back to rule-based prediction if ML model is not available.
    """
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.model_path = os.path.join(settings.BASE_DIR, 'models', 'fit_predictor.pkl')
        self.scaler_path = os.path.join(settings.BASE_DIR, 'models', 'scaler.pkl')
        self.load_model()
    
    def load_model(self):
        """Load pre-trained model and scaler if they exist"""
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
            if os.path.exists(self.scaler_path):
                self.scaler = joblib.load(self.scaler_path)
        except Exception as e:
            print(f"Could not load ML model: {e}")
            self.model = None
            self.scaler = None
    
    def extract_features(self, user_meas, outfit_meas):
        """
        Extract features from user and outfit measurements.
        
        Args:
            user_meas: dict with user measurements
            outfit_meas: dict with outfit measurements
            
        Returns:
            np.array: Feature vector
        """
        features = []
        
        # Get measurements with defaults
        user_chest = float(user_meas.get('chest', 0))
        user_waist = float(user_meas.get('waist', 0))
        user_hips = float(user_meas.get('hips', 0))
        user_shoulder = float(user_meas.get('shoulder', 0))
        
        outfit_chest = float(outfit_meas.get('chest', 0))
        outfit_waist = float(outfit_meas.get('waist', 0))
        outfit_hips = float(outfit_meas.get('hips', 0))
        outfit_shoulder = float(outfit_meas.get('shoulder', 0))
        
        # Absolute differences
        features.append(abs(outfit_chest - user_chest))
        features.append(abs(outfit_waist - user_waist))
        features.append(abs(outfit_hips - user_hips))
        if user_shoulder and outfit_shoulder:
            features.append(abs(outfit_shoulder - user_shoulder))
        else:
            features.append(0)
        
        # Relative differences (percentages)
        if user_chest > 0:
            features.append((outfit_chest - user_chest) / user_chest * 100)
        else:
            features.append(0)
        
        if user_waist > 0:
            features.append((outfit_waist - user_waist) / user_waist * 100)
        else:
            features.append(0)
        
        if user_hips > 0:
            features.append((outfit_hips - user_hips) / user_hips * 100)
        else:
            features.append(0)
        
        # Body shape indicators (ratios)
        if user_waist > 0:
            features.append(user_chest / user_waist)
            features.append(user_hips / user_waist)
        else:
            features.append(0)
            features.append(0)
        
        # Outfit proportions
        if outfit_waist > 0:
            features.append(outfit_chest / outfit_waist)
            features.append(outfit_hips / outfit_waist)
        else:
            features.append(0)
            features.append(0)
        
        return np.array(features).reshape(1, -1)
    
    def predict(self, user_measurements, outfit_measurements):
        """
        Predict fit score and status using ML model or rule-based fallback.
        
        Args:
            user_measurements: dict with user measurements
            outfit_measurements: dict with outfit measurements
            
        Returns:
            tuple: (fit_score, fit_status, recommendations)
        """
        # Try ML prediction if model is available
        if self.model is not None and self.scaler is not None:
            try:
                features = self.extract_features(user_measurements, outfit_measurements)
                features_scaled = self.scaler.transform(features)
                
                # Predict fit score (0-100)
                score = self.model.predict(features_scaled)[0]
                score = max(0, min(100, score))  # Ensure in range
                
                # Determine status based on score
                if score >= 90:
                    fit_status = 'perfect'
                elif score >= 75:
                    fit_status = 'good'
                elif score >= 50:
                    fit_status = 'loose'
                else:
                    fit_status = 'tight'
                
                recommendations = self._generate_recommendations(
                    user_measurements, outfit_measurements, fit_status, score
                )
                
                return score, fit_status, recommendations
            except Exception as e:
                print(f"ML prediction failed: {e}, falling back to rule-based")
        
        # Fallback to rule-based prediction
        return self._rule_based_prediction(user_measurements, outfit_measurements)
    
    def _rule_based_prediction(self, user_meas, outfit_meas):
        """
        Rule-based fit prediction (fallback method).
        
        Args:
            user_meas: dict with user measurements
            outfit_meas: dict with outfit measurements
            
        Returns:
            tuple: (fit_score, fit_status, recommendations)
        """
        from decimal import Decimal
        
        score = Decimal('100.0')
        recommendations = []
        
        # Calculate differences
        chest_diff = abs(outfit_meas.get('chest', 0) - user_meas.get('chest', 0))
        waist_diff = abs(outfit_meas.get('waist', 0) - user_meas.get('waist', 0))
        hips_diff = abs(outfit_meas.get('hips', 0) - user_meas.get('hips', 0))
        
        # Deduct points based on differences
        if chest_diff > 5:
            score -= Decimal(chest_diff * 2)
            fit_type = 'tight' if outfit_meas.get('chest', 0) < user_meas.get('chest', 0) else 'loose'
            recommendations.append(f"Chest fit may be {fit_type}")
        
        if waist_diff > 5:
            score -= Decimal(waist_diff * 2)
            fit_type = 'tight' if outfit_meas.get('waist', 0) < user_meas.get('waist', 0) else 'loose'
            recommendations.append(f"Waist fit may be {fit_type}")
        
        if hips_diff > 5:
            score -= Decimal(hips_diff * 2)
            fit_type = 'tight' if outfit_meas.get('hips', 0) < user_meas.get('hips', 0) else 'loose'
            recommendations.append(f"Hip fit may be {fit_type}")
        
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
        
        return float(score), fit_status, "\n".join(recommendations)
    
    def _generate_recommendations(self, user_meas, outfit_meas, fit_status, score):
        """Generate fit recommendations based on measurements and prediction"""
        recommendations = []
        
        # Check each measurement
        chest_diff = outfit_meas.get('chest', 0) - user_meas.get('chest', 0)
        waist_diff = outfit_meas.get('waist', 0) - user_meas.get('waist', 0)
        hips_diff = outfit_meas.get('hips', 0) - user_meas.get('hips', 0)
        
        if abs(chest_diff) > 5:
            if chest_diff > 0:
                recommendations.append(f"Chest area may be loose by {abs(chest_diff):.1f} cm")
            else:
                recommendations.append(f"Chest area may be tight by {abs(chest_diff):.1f} cm")
        
        if abs(waist_diff) > 5:
            if waist_diff > 0:
                recommendations.append(f"Waist may be loose by {abs(waist_diff):.1f} cm")
            else:
                recommendations.append(f"Waist may be tight by {abs(waist_diff):.1f} cm")
        
        if abs(hips_diff) > 5:
            if hips_diff > 0:
                recommendations.append(f"Hip area may be loose by {abs(hips_diff):.1f} cm")
            else:
                recommendations.append(f"Hip area may be tight by {abs(hips_diff):.1f} cm")
        
        if not recommendations:
            if fit_status == 'perfect':
                recommendations.append("Perfect fit! This outfit matches your measurements excellently.")
            elif fit_status == 'good':
                recommendations.append("Good fit! This outfit should work well for you.")
            else:
                recommendations.append("This outfit may require some adjustments.")
        
        return "\n".join(recommendations)
    
    def train(self, training_data, labels):
        """
        Train the ML model on user feedback data.
        
        Args:
            training_data: List of feature arrays
            labels: List of fit scores
        """
        try:
            # Create and train scaler
            self.scaler = StandardScaler()
            X_scaled = self.scaler.fit_transform(training_data)
            
            # Create and train model
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42
            )
            self.model.fit(X_scaled, labels)
            
            # Save model and scaler
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            joblib.dump(self.model, self.model_path)
            joblib.dump(self.scaler, self.scaler_path)
            
            return True
        except Exception as e:
            print(f"Error training model: {e}")
            return False


# Global instance
_fit_predictor = None


def get_fit_predictor():
    """Get or create global FitPredictor instance"""
    global _fit_predictor
    if _fit_predictor is None:
        _fit_predictor = FitPredictor()
    return _fit_predictor
