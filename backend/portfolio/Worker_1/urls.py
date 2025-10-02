from rest_framework import routers
from .views import ProjectViewSet, StackViewSet

router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'stacks', StackViewSet)

urlpatterns = router.urls
