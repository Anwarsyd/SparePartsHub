from django.db import models

class BikeBrand(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class BikeModel(models.Model):
    brand = models.ForeignKey(
        BikeBrand,
        on_delete=models.CASCADE,
        related_name="models"
    )
    name = models.CharField(max_length=100)
    year_from = models.PositiveIntegerField()
    year_to = models.PositiveIntegerField()

    class Meta:
        unique_together = ("brand", "name", "year_from", "year_to")

    def __str__(self):
        return f"{self.brand.name} {self.name}"


class Part(models.Model):
    name = models.CharField(max_length=150)
    part_number = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    compatible_bikes = models.ManyToManyField(
        BikeModel,
        related_name="compatible_parts",
        blank=True
    )

    def __str__(self):
        return f"{self.name} - {self.part_number}"