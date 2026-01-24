from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Permission class that only allows admin users to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission class that allows read-only access to all users,
    but only allows write access to admin users.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_admin

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission class that allows access to the owner of an object or admin users.
    """
    def has_object_permission(self, request, view, obj):
        # Admin users have full access
        if request.user.is_admin:
            return True
        
        # Check if the object has a user field
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # Default to checking if the object is the user itself
        return obj == request.user
