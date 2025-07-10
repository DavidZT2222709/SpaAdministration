from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status
from django.db.models.functions import TruncMonth
from django.http import HttpResponse
from .models import *
from .serializers import *
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import datetime


class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

class ColaboradorViewSet(viewsets.ModelViewSet):
    queryset = Colaborador.objects.all()
    serializer_class = ColaboradorSerializer

class TratamientoViewSet(viewsets.ModelViewSet):
    queryset = Tratamiento.objects.all()
    serializer_class = TratamientoSerializer

class AperitivoViewSet(viewsets.ModelViewSet):
    queryset = Aperitivo.objects.all()
    serializer_class = AperitivoSerializer

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all().order_by('-fecha_hora')
    serializer_class = CitaSerializer

class HistoriaClinicaViewSet(viewsets.ModelViewSet):
    queryset = HistoriaClinica.objects.all().order_by('-created_at')
    serializer_class = HistoriaClinicaSerializer

class HistoriasPorPaciente(APIView):
    def get(self, request):
        pacientes_data = []
        pacientes = Paciente.objects.all()

        for paciente in pacientes:
            citas = paciente.cita_set.select_related('colaborador', 'servicio').order_by('-fecha_hora')
            citas_data = []
            for cita in citas:
                if hasattr(cita, 'historiaclinica'):
                    historia = cita.historiaclinica
                    citas_data.append({
                        'id': cita.id,
                        'fecha_hora': cita.fecha_hora,
                        'colaborador_nombre': cita.colaborador.nombres,
                        'servicio_nombre': cita.servicio.nombre,
                        'tratamiento': historia.tratamiento,
                        'observaciones': historia.observaciones,
                        'recomendaciones': historia.recomendaciones
                    })

            if citas_data:
                pacientes_data.append({
                    'paciente_id': paciente.id,
                    'paciente_nombre': f"{paciente.nombres} {paciente.apellidos}",
                    'citas': citas_data
                })

        return Response(pacientes_data)

class TipoDocumentoChoices(APIView): 
    def get(self, request):
        return Response([
            {'codigo': value, 'nombre': label}
            for value, label in Paciente.DOCUMENT_TYPES
        ])
    
class TipoDocumentoChoices2(APIView): 
    def get(self, request):
        return Response([
            {'codigo': value, 'nombre': label}
            for value, label in Colaborador.DOCUMENT_TYPES
        ])
    
@api_view(['GET'])
def appointment_statuses(request):
    return Response([
        {'value': k, 'label': v}
        for k, v in dict(Cita.ESTADOS_TYPES). items()
    ])

def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    self.perform_create(serializer)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

