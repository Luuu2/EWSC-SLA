import django_filters
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes, api_view, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import generics

from api.serializers import SlaEntrySerializer, DepartmentSerializer, ListSlaEntrySerializer, ListSlaRatingSerializer, \
    SlaRatingSerializer
from core.models import SlaEntry, Department, SlaRating


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.order_by('pk')
    permission_classes = [IsAuthenticated, ]
    serializer_class = DepartmentSerializer


# ======================================================================

class SlaEntryViewSet(viewsets.ModelViewSet):
    queryset = SlaEntry.objects.order_by('pk')
    permission_classes = [IsAuthenticated, ]
    filterset_fields = ['department', ]

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return ListSlaEntrySerializer
        return SlaEntrySerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_sla_entry(request: Request):
    data = {
        **request.data,
        'added_by': request.user.pk
    }
    form = SlaEntrySerializer(data=data, many=False)
    if form.is_valid():

        if SlaEntry.objects.filter(department=form.validated_data['department']).count() >= 5:
            return Response(
                data={'error': 'Can only add a maximum of 5 SLA entries per department.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        entry = form.save()
        return Response(
            data=SlaEntrySerializer(instance=entry).data,
            status=status.HTTP_200_OK
        )

    return Response(
        data=form.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# ======================================================================

class UserSlaRatingEntriesView(generics.ListAPIView):
    class SlaRatingFilter(django_filters.FilterSet):
        department = django_filters.CharFilter(field_name='sla__department', lookup_expr='exact')

        class Meta:
            model = SlaRating
            fields = ('department',)

    permission_classes = [IsAuthenticated, ]
    filterset_class = SlaRatingFilter
    serializer_class = ListSlaRatingSerializer

    def get_queryset(self):
        return SlaRating.objects.filter(
            rated_by=self.request.user
        ).order_by('pk')


class SlaRatingEntryViewSet(viewsets.ModelViewSet):
    queryset = SlaRating.objects.order_by('pk')
    permission_classes = [IsAuthenticated, ]
    filterset_fields = ['rated_by', ]

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return ListSlaRatingSerializer
        return SlaRatingSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_sla_rating_entry(request: Request):
    data = {
        **request.data,
        'rated_by': request.user.pk
    }
    form = SlaRatingSerializer(data=data, many=False)
    if form.is_valid():
        rating = form.save()
        return Response(
            data=SlaRatingSerializer(instance=rating).data,
            status=status.HTTP_200_OK
        )

    return Response(
        data=form.errors,
        status=status.HTTP_400_BAD_REQUEST
    )
