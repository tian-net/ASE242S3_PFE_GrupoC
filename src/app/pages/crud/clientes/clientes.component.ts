import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], //  Uso de ReactiveFormsModule
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  clienteForm: FormGroup; //  FormGroup reactivo
  editando = false;
  idEditando?: number;

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder //  Inyección de FormBuilder
  ) {
    //  1. ESTRUCTURA BASE DEL FORMULARIO REACTIVO
    // Configuración del FormGroup con FormBuilder
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]], //  Validaciones reactivas
      correo: ['', [Validators.required, Validators.email]], //  Validación de email
      telefono: ['', [Validators.required, Validators.pattern(/^9[0-9]{8}$/)]] //  Solo 9 dígitos que comienzan con 9
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.listar().subscribe(data => this.clientes = data);
  }

  //  3. MANEJO DE EVENTOS - Guardar
  guardar(): void {
    //  2. VALIDACIONES REACTIVAS
    // Validación: solo guardar si el formulario es válido
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
      return;
    }

    const cliente: Cliente = this.clienteForm.value;

    if (this.editando && this.idEditando) {
      // Actualizar cliente existente
      this.clienteService.actualizar(this.idEditando, cliente).subscribe(() => {
        this.cargarClientes();
        this.limpiarFormulario();
      });
    } else {
      // Crear nuevo cliente
      this.clienteService.crear(cliente).subscribe(() => {
        this.cargarClientes();
        this.limpiarFormulario();
      });
    }
  }

  //  3. MANEJO DE EVENTOS - Editar
  editar(cliente: Cliente): void {
    this.editando = true;
    this.idEditando = cliente.id;
    // Llenar el formulario reactivo con los datos del cliente
    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      correo: cliente.correo,
      telefono: cliente.telefono || ''
    });
  }

  //  3. MANEJO DE EVENTOS - Eliminar
  eliminar(id?: number): void {
    if (id && confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clienteService.eliminar(id).subscribe(() => this.cargarClientes());
    }
  }

  // Limpieza del formulario reactivo
  limpiarFormulario(): void {
    this.clienteForm.reset(); // Resetea valores y estados de validación
    this.editando = false;
    this.idEditando = undefined;
  }

  //   MÉTODOS AUXILIARES PARA LA INTERFAZ
  // Getters para acceder a los controles en el template
  get nombre() {
    return this.clienteForm.get('nombre');
  }

  get correo() {
    return this.clienteForm.get('correo');
  }

  get telefono() {
    return this.clienteForm.get('telefono');
  }

  // Método para verificar si un campo es inválido y fue tocado
  campoInvalido(campo: string): boolean {
    const control = this.clienteForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
