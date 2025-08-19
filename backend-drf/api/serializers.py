from rest_framework import serializers


class StockPredictionSerializer(serializers.Serializer):
    ticker = serializers.CharField(max_length=20)

class StockReturnsSerializer(serializers.Serializer):
    ticker1= serializers.CharField(max_length=20)
    year = serializers.IntegerField(min_value=1, max_value=99)
