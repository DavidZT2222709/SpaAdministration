# Generated by Django 5.2 on 2025-07-10 01:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Aperitivo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='Colaborador',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombres', models.CharField(max_length=100)),
                ('apellidos', models.CharField(max_length=100)),
                ('tipo_documento', models.CharField(choices=[('CC', 'Cédula de ciudadanía'), ('CE', 'Cédula de extranjería')], default='CC', max_length=2)),
                ('numero_documento', models.CharField(max_length=10, unique=True)),
                ('celular', models.CharField(max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Paciente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombres', models.CharField(max_length=100)),
                ('apellidos', models.CharField(max_length=100)),
                ('tipo_documento', models.CharField(choices=[('CC', 'Cédula de ciudadanía'), ('TI', 'Tarjeta de identidad'), ('CE', 'Cédula de extranjería')], default='CC', max_length=2)),
                ('numero_documento', models.CharField(max_length=10, unique=True)),
                ('celular', models.CharField(max_length=10)),
                ('direccion', models.CharField(blank=True, max_length=100, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True, unique=True)),
                ('fecha_nacimiento', models.DateField()),
                ('emergencia_nombre', models.CharField(blank=True, max_length=500, null=True)),
                ('emergencia_number', models.CharField(blank=True, max_length=10, null=True)),
                ('condiciones_medicas', models.TextField(blank=True, null=True)),
                ('alergias', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Servicio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('duracion', models.PositiveIntegerField(default=60, help_text='Duración en minutos')),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tratamiento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('duracion', models.PositiveIntegerField(default=60, help_text='Duración en minutos')),
                ('descripcion', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='HistoriaClinica',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observaciones', models.TextField(blank=True, null=True)),
                ('recomendaciones', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('paciente', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='historia_clinica', to='negocio.paciente')),
            ],
        ),
        migrations.CreateModel(
            name='Cita',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_hora', models.DateField()),
                ('hora', models.TimeField()),
                ('estado', models.CharField(choices=[('PEND', 'Pendiente'), ('REAL', 'Realizada'), ('CANC', 'Cancelada')], default='PEND', max_length=4)),
                ('notas', models.TextField(blank=True, null=True)),
                ('saldo_pend', models.DecimalField(decimal_places=2, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('colaborador', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='negocio.colaborador')),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='negocio.paciente')),
                ('servicio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='negocio.servicio')),
            ],
        ),
        migrations.AddField(
            model_name='servicio',
            name='tratamientos',
            field=models.ManyToManyField(blank=True, to='negocio.tratamiento'),
        ),
    ]
