from django.db import models
    
    #TRATAMIENTO

class Tratamiento(models.Model):
    nombre = models.CharField(max_length=100)
    duracion = models.PositiveIntegerField(default=60, help_text="Duración en minutos")
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre
    
    #APERITIVO

class Aperitivo(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nombre 

#TRABAJADOR


class Colaborador(models.Model):
    DOCUMENT_TYPES = [
        ('CC', 'Cédula de ciudadanía'),
        ('CE', 'Cédula de extranjería'),
    ]
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    tipo_documento = models.CharField(
        max_length=2,
        choices=DOCUMENT_TYPES,
        default='CC'
    )
    numero_documento = models.CharField(max_length=10, unique=True)
    celular = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

#SERVICIO

class Servicio(models.Model):
    nombre = models.CharField(max_length=100)
    duracion = models.PositiveIntegerField(default=60, help_text="Duración en minutos")
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    tratamientos = models.ManyToManyField(Tratamiento, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre
    
#PACIENTE

class Paciente(models.Model):
    DOCUMENT_TYPES = [
        ('CC', 'Cédula de ciudadanía'),
        ('TI', 'Tarjeta de identidad'),
        ('CE', 'Cédula de extranjería'),
    ]

    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    tipo_documento = models.CharField(
        max_length=2,
        choices=DOCUMENT_TYPES,
        default='CC'
    )
    numero_documento = models.CharField(max_length=10, unique=True)
    celular = models.CharField(max_length=10)
    direccion = models.CharField(max_length=100, blank=True, null=True)
    fecha_nacimiento = models.DateField()
    #-------------------------------------------
    emergencia_nombre = models.CharField(max_length=500, blank=True, null=True)
    emergencia_number = models.CharField(max_length=10, blank=True, null=True)
    #-------------------------------------------
    condiciones_medicas = models.TextField(blank=True, null=True)
    alergias = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"
    
#CITA

class Cita(models.Model):
    ESTADOS_TYPES = [
        ('PEND', 'Pendiente'),
        ('REAL', 'Realizada'),
        ('CANC', 'Cancelada'),
    ]

    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    colaborador = models.ForeignKey(Colaborador, on_delete=models.CASCADE)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)
    aperitivos = models.ManyToManyField(Aperitivo, blank=True)
    fecha_hora = models.DateField()
    hora = models.TimeField()
    estado = models.CharField(max_length=4, choices=ESTADOS_TYPES, default='PEND')
    notas = models.TextField(blank=True, null=True)
    saldo_pend = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cita de {self.paciente} - {self.fecha_hora.strftime('%Y-%m-%d %H:%M')}"

   # HISTORIA CLÍNICA

class HistoriaClinica(models.Model):
    paciente = models.OneToOneField(Paciente, on_delete=models.CASCADE, related_name='historia_clinica')
    observaciones = models.TextField(blank=True, null=True)
    recomendaciones = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Historia clínica - {self.paciente}"