import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(backend_dir)
for p in [backend_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

from backend.app.main import app
