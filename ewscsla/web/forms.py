from django import forms

from core.models import SlaEntry, SlaRating


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
        exclude = []
