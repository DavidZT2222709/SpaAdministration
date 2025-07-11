from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('pacientes', PacienteViewSet)
router.register('trabajadores', ColaboradorViewSet)
router.register('tratamientos', TratamientoViewSet)
router.register('aperitivos', AperitivoViewSet)
router.register('servicios', ServicioViewSet)
router.register('citas', CitaViewSet)
router.register('historias', HistoriaClinicaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('tipos-documento/', TipoDocumentoChoices.as_view(), name='tipos-documento'),
    path('tipos-documento2/', TipoDocumentoChoices2.as_view(), name='tipos-documento'),
    path('estados-cita/', appointment_statuses, name='estados-cita'),
    path('historias-clinicas/', HistoriasPorPaciente.as_view(), name='historias-clinicas'),
    path('docs/', include_docs_urls(title='Negocio API'))
]
