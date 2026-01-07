from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from core.models import PredefinedCar, Skill
from .serializers import SkillSerializer

@extend_schema(
    tags=['Skills Sharing'],
    request=SkillSerializer,
    responses={201: SkillSerializer},
    parameters=[
        OpenApiParameter(name='vehicle_id', description='ID of the predefined car', required=True, type=int),
        OpenApiParameter(name='vehicle_part', description='Part of the vehicle', required=True, type=str),
        OpenApiParameter(name='steps', description='List of steps for the skill', required=True, type=OpenApiTypes.OBJECT),
    ],
    examples=[
        OpenApiExample(
            'Valid Request Example',
            value={
                'vehicle_id': 1,
                'vehicle_part': 'Engine',
                'steps': ['Step 1', 'Step 2', 'Step 3']
            },
            request_only=True,
        )
    ]
)
class AddSkillView(APIView):
    def post(self, request, *args, **kwargs):
        vehicle_id = request.data.get('vehicle_id')
        vehicle_part = request.data.get('vehicle_part')
        steps = request.data.get('steps')
        
        if not vehicle_id or not vehicle_part or not steps:
            return Response({
                'vehicle_id': ['This field is required.'] if not vehicle_id else None,
                'vehicle_part': ['This field is required.'] if not vehicle_part else None,
                'steps': ['This field is required.'] if not steps else None
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            PredefinedCar.objects.get(pk=vehicle_id)
        except PredefinedCar.DoesNotExist:
            return Response({'detail': 'Vehicle not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        skill_data = {
            'vehicle_id': vehicle_id,
            'vehicle_part': vehicle_part,
            'steps': steps
        }
        
        skill_serializer = SkillSerializer(data=skill_data)
        if skill_serializer.is_valid():
            skill_serializer.save()
            return Response(skill_serializer.data, status=status.HTTP_201_CREATED)
        return Response(skill_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    tags=['Skills Sharing'],
    responses={200: SkillSerializer(many=True)},
    parameters=[
        OpenApiParameter(name='vehicle_id', description='Filter skills by vehicle ID', required=False, type=int),
    ]
)
class ListSkillsView(generics.ListAPIView):
    serializer_class = SkillSerializer
    queryset = Skill.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()
        vehicle_id = self.request.query_params.get('vehicle_id')
        if vehicle_id:
            queryset = queryset.filter(vehicle_id=vehicle_id)
        return queryset

@extend_schema(
    tags=['Skills Sharing'],
    responses={200: SkillSerializer}
)
class RetrieveSkillView(generics.RetrieveAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

@extend_schema(
    tags=['Skills Sharing'],
    request=SkillSerializer,
    responses={200: SkillSerializer}
)
class EditSkillView(generics.UpdateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

@extend_schema(
    tags=['Skills Sharing'],
    responses={204: None}
)
class DeleteSkillView(generics.DestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

@extend_schema(
    tags=['Skills Sharing'],
    responses={200: SkillSerializer(many=True)},
    parameters=[
        OpenApiParameter(name='vehicle_id', description='ID of the vehicle to get skills for', required=True, type=int),
    ]
)
class GetSkillsByVehicleView(generics.ListAPIView):
    serializer_class = SkillSerializer

    def get_queryset(self):
        vehicle_id = self.kwargs.get('vehicle_id')
        try:
            PredefinedCar.objects.get(pk=vehicle_id)
        except PredefinedCar.DoesNotExist:
            raise NotFound(f'Vehicle with ID {vehicle_id} not found.')
        return Skill.objects.filter(vehicle_id=vehicle_id)
