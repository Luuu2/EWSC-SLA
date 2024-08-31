from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.views import DepartmentViewSet, SlaEntryViewSet, SlaRatingEntryViewSet, add_sla_entry, \
    UserSlaRatingEntriesView, add_sla_rating_entry

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='departments')
router.register(r'sla', SlaEntryViewSet, basename='sla_entries')
router.register(r'sla-ratings', SlaRatingEntryViewSet, basename="sla_ratings")

app_name = "api"
urlpatterns = [
    path("", include(router.urls), name="api"),
    path('add-sla/', add_sla_entry, name="add-sla-entry"),

    path('user-sla-ratings/', UserSlaRatingEntriesView.as_view()),
    path('add-sla-rating/', add_sla_rating_entry),
]
