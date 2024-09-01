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
        fields = ('id', 'last_login', 'username', 'get_full_name', 'email', 'department', 'initials')


# ======================================================================

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


# ======================================================================

class ListSlaEntrySerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(many=False, read_only=True)
    added_by = serializers.SerializerMethodField()

    class Meta:
        model = SlaEntry
        fields = '__all__'

    def get_added_by(self, obj: SlaEntry):
        if obj:
            full_name = obj.added_by.get_full_name()
            return full_name if full_name else f"@{obj.added_by.username}"
        return None


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
    improvement_action_plan = SlaImprovementPlanEntrySerializer(many=False, read_only=True)
    customer_feedback_status = SlaCustomerStatusEntrySerializer(many=False, read_only=True)

    class Meta:
        model = SlaRating
        fields = "__all__"

    def get_rated_by(self, obj: SlaRating):
        if obj:
            full_name = obj.rated_by.get_full_name()
            return full_name if full_name else f"@{obj.rated_by.username}"
        return None


class SlaRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlaRating
        fields = "__all__"

# ======================================================================
