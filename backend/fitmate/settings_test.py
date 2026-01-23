"""
Test settings for Fitmate backend
Uses SQLite for faster testing without MySQL dependency
"""
from .settings import *

# Use SQLite for tests
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Use default hasher (PBKDF2) for tests - secure and built-in
# Tests will be slightly slower but still acceptable


# Disable migrations for faster tests
class DisableMigrations:
    def __contains__(self, item):
        return True
    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()
