from rest_framework import serializers

from core.models import Department, SlaEntry, SlaRating, SlaImprovementPlanEntry, SlaCustomerStatusEntry, AuthUser


class AuthUserSerializer(serializers.ModelSerializer):
    class UserDepartmentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Department
            fields = '__all__'

    department = UserDepartmentSerializer(many=False, read_only=True)

    class Meta:
        model = AuthUser
        fields = ('id', 'last_login', 'username', 'get_full_name',
                  'email', 'department', 'initials')


# ======================================================================

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


# ======================================================================

class ListSlaEntrySerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(many=False, read_only=True)
    added_by = serializers.SerializerMethodField()
    is_author = serializers.SerializerMethodField()

    class Meta:
        model = SlaEntry
        fields = '__all__'

    def get_added_by(self, obj: SlaEntry):
        if obj:
            full_name = obj.added_by.get_full_name()
            return full_name if full_name else f"@{obj.added_by.username}"
        return None

    def get_is_author(self, obj: SlaEntry):
        request = self.context.get('request', None)
        if request:
            return request.user == obj.added_by
        return False


class SlaEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SlaEntry
        fields = '__all__'


# ======================================================================

class SlaImprovementPlanEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SlaImprovementPlanEntry
        fields = "__all__"


# ======================================================================

class SlaCustomerStatusEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = SlaCustomerStatusEntry
        fields = "__all__"


# ======================================================================

class ListSlaRatingSerializer(serializers.ModelSerializer):
    sla = ListSlaEntrySerializer(many=False, read_only=True)
    rated_by = serializers.SerializerMethodField()
    improvement_action_plan = SlaImprovementPlanEntrySerializer(
        many=False, read_only=True)
    customer_feedback_status = SlaCustomerStatusEntrySerializer(
        many=False, read_only=True)
    # if the user can delete the rating, can only delete a rating you own
    can_delete = serializers.SerializerMethodField()

    class Meta:
        model = SlaRating
        fields = "__all__"

    def get_rated_by(self, obj: SlaRating):
        if obj:
            # full_name = obj.rated_by.get_full_name()
            # return full_name if full_name else f"@{obj.rated_by.username}"
            return obj.rated_by.department.name if obj.rated_by.department else obj.rated_by.username
        return None

    def get_can_delete(self, obj: SlaRating) -> bool:
        request = self.context.get('request', None)
        if request and hasattr(request, 'user') and obj:
            return request.user.is_authenticated and obj.rated_by == request.user
        return False


class SlaRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlaRating
        fields = "__all__"

    def validate(self, data):
        """
        Custom validation to make the reason field optional for ratings 3 and above.
        """
        rating = data.get('rating')
        reason = data.get('reason')

        # Check if the rating is provided and is a number less than 3
        if rating is not None and rating < 3:
            # If a rating is less than 3, the reason field is required.
            if not reason or reason.strip() == "":
                raise serializers.ValidationError(
                    {"reason": "Rating reason is required for ratings below 3."}
                )

        return data


# ======================================================================

class AggregatedRatingsSerializer(serializers.Serializer):
    class RatingsSerializer(serializers.Serializer):
        Met_None = serializers.IntegerField(default=0)
        Met_Some = serializers.IntegerField(default=0)
        Met_All = serializers.IntegerField(default=0)
        Exceeded_Some = serializers.IntegerField(default=0)
        Exceeded_All = serializers.IntegerField(default=0)

    ratings = RatingsSerializer(many=False, read_only=True)
    department = serializers.CharField(max_length=100)


class AggregatedDepartmentDataSerializer(serializers.ModelSerializer):
    employees_count = serializers.IntegerField()
    sla_entries_count = serializers.IntegerField()

    class Meta:
        model = Department
        fields = '__all__'

# ======================================================================
