from rest_framework import serializers
from .models import Paciente, Colaborador, Servicio, Tratamiento, Cita, HistoriaClinica, Aperitivo

class TratamientoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tratamiento
        fields = '__all__'

class AperitivoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Aperitivo
        fields = '__all__'

class ServicioSerializer(serializers.ModelSerializer):
    tratamientos = TratamientoSerializer(many=True, read_only=True)

    class Meta:
        model = Servicio
        fields = '__all__'

class PacienteSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Paciente
        fields = '__all__'

class ColaboradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaborador
        fields = '__all__'

class CitaSerializer(serializers.ModelSerializer):
    paciente = PacienteSerializer(read_only=True)
    colaborador = ColaboradorSerializer(read_only=True)
    servicio = ServicioSerializer(read_only=True)

    paciente_id = serializers.PrimaryKeyRelatedField(queryset=Paciente.objects.all(), write_only=True)
    colaborador_id = serializers.PrimaryKeyRelatedField(queryset=Colaborador.objects.all(), write_only=True)
    servicio_id = serializers.PrimaryKeyRelatedField(queryset=Servicio.objects.all(), write_only=True)

    aperitivos = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Aperitivo.objects.all(),
        write_only=True
    )

    aperitivos_info = AperitivoSerializer(many=True, read_only=True, source='aperitivos')

    class Meta:
        model = Cita
        fields = [
            'id',
            'paciente', 'paciente_id',
            'colaborador', 'colaborador_id',
            'servicio', 'servicio_id',
            'aperitivos', 'aperitivos_info',
            'fecha_hora', 'hora',
            'notas', 'estado', 'saldo_pend',
            'created_at'
        ]

    def create(self, validated_data):
        paciente = validated_data.pop('paciente_id')
        colaborador = validated_data.pop('colaborador_id')
        servicio = validated_data.pop('servicio_id')
        aperitivos = validated_data.pop('aperitivos', [])

        cita = Cita.objects.create(
            paciente=paciente,
            colaborador=colaborador,
            servicio=servicio,
            **validated_data
        )

        cita.aperitivos.set(aperitivos)

        # Calcular el total: servicio + aperitivos
        total_aperitivos = sum([a.precio for a in aperitivos])
        cita.saldo_pend = servicio.precio + total_aperitivos
        cita.save()

        return cita

    def update(self, instance, validated_data):
        if 'paciente_id' in validated_data:
            instance.paciente = validated_data.pop('paciente_id')
        if 'colaborador_id' in validated_data:
            instance.colaborador = validated_data.pop('colaborador_id')
        if 'servicio_id' in validated_data:
            instance.servicio = validated_data.pop('servicio_id')
        if 'aperitivos' in validated_data:
            aperitivos = validated_data.pop('aperitivos')
            instance.aperitivos.set(aperitivos)
        else:
            aperitivos = instance.aperitivos.all()  # mantener los actuales si no llegan nuevos

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Recalcular saldo_pend si no fue enviado explícitamente
        if 'saldo_pend' not in validated_data:
            total = 0
            if instance.servicio:
                total += float(instance.servicio.precio or 0)
            total += sum(float(ap.precio or 0) for ap in aperitivos)
            instance.saldo_pend = total

        instance.save()
        return instance

class HistoriaClinicaSerializer(serializers.ModelSerializer):
    cita = CitaSerializer(read_only=True)

    class Meta:
        model = HistoriaClinica
        fields = '__all__'
