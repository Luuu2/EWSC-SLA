import django_filters
from django.http import HttpResponse
from django.utils import timezone
from openpyxl.workbook import Workbook
from openpyxl.writer.excel import save_virtual_workbook
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes, api_view, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import generics

from api.serializers import SlaEntrySerializer, DepartmentSerializer, ListSlaEntrySerializer, ListSlaRatingSerializer, \
    SlaRatingSerializer, SlaImprovementPlanEntrySerializer, SlaCustomerStatusEntrySerializer
from core.models import SlaEntry, Department, SlaRating, SlaImprovementPlanEntry, SlaCustomerStatusEntry


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

class SlaRatingFilter(django_filters.FilterSet):
    department = django_filters.CharFilter(field_name='sla__department', lookup_expr='exact')

    class Meta:
        model = SlaRating
        fields = ('department',)


class UserSlaRatingEntriesView(generics.ListAPIView):
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
    filterset_class = SlaRatingFilter

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


# ======================================================================

class SlaImprovementActionPlanViewSet(viewsets.ModelViewSet):
    queryset = SlaImprovementPlanEntry.objects.order_by('pk')
    permission_classes = [IsAuthenticated, ]
    serializer_class = SlaImprovementPlanEntrySerializer


# ======================================================================

class SlaCustomerStatusPlanViewSet(viewsets.ModelViewSet):
    queryset = SlaCustomerStatusEntry.objects.order_by('pk')
    permission_classes = [IsAuthenticated, ]
    serializer_class = SlaCustomerStatusEntrySerializer


@api_view(['GET'])
def generate_report(request):
    try:
        today = timezone.now().strftime("%Y_%m_%d_%H_%M")

        workbook = Workbook()
        worksheet = workbook.active

        worksheet.append(["ESWATINI WATER SERVICES CORPORATION"])
        worksheet.append([])
        worksheet.append(["SLA's MONITORING TOOL"])

        worksheet.append([
            "Internal Service Provider", "Internal Customer", "Report Qrt Date",
            "Rating", "Reason for rating", "Agreed Improvement Action", "Due Date",
            "Manager Status (Service Provider)", "Internal Customer Status"
        ])

        sla_ratings = SlaRating.objects.order_by('updated_at')
        for rating in sla_ratings:
            service_provider = rating.sla.department.name
            customer = rating.rated_by.department.name if (rating.rated_by and rating.rated_by.department) else "N/A"
            sla_date = rating.sla.date.strftime("%Y-%m-%d")
            rating_value = str(int(rating.rating))
            reason = rating.reason
            action_plan = rating.action_plan.improvement_action if hasattr(rating, 'action_plan') else "N/A"
            due_date = rating.action_plan.due_date.strftime("%Y-%m-%d") if hasattr(rating, 'action_plan') else "N/A"
            manager_status = rating.action_plan.get_status_display() if hasattr(rating, 'action_plan') else "N/A"
            customer_status = rating.customer_status.get_status_display() \
                if hasattr(rating, 'customer_status') else "N/A"

            worksheet.append([
                service_provider, customer, sla_date, rating_value, reason, action_plan, due_date, manager_status,
                customer_status
            ])

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename=SLA_REPORT_{today}.xlsx'
        response.write(save_virtual_workbook(workbook))

        return response

    except Exception as error:
        return Response({
            'error': 'Failed to generate report',
            'debug': str(error)
        }, status=status.HTTP_400_BAD_REQUEST)
