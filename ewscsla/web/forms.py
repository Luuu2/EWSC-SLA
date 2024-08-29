from django import forms

from core.models import SlaEntry, SlaRating, SlaImprovementPlanEntry, SlaCustomerStatusEntry


class CreateSlaEntryItemForm(forms.ModelForm):
    # make the form department not required from the form
    # enforce the department in the other field,
    # as well as the date
    class Meta:
        model = SlaEntry
        exclude = ('department', 'date')


class CreateSlaEntryForm(forms.Form):
    date = forms.DateField()
    department = forms.IntegerField()


class CreateSlaRatingForm(forms.ModelForm):
    class Meta:
        model = SlaRating
        exclude = ['sla', ]


class SlaImprovementPlanEntryForm(forms.ModelForm):
    class Meta:
        model = SlaImprovementPlanEntry
        exclude = ['rating']


class SlaCustomerStatusEntryForm(forms.ModelForm):
    class Meta:
        model = SlaCustomerStatusEntry
        exclude = ['improvement_plan']
