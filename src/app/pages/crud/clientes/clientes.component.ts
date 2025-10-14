
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  clienteActual: Cliente = { nombre: '', correo: '' };
  editando = false;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.listar().subscribe(data => this.clientes = data);
  }

  guardar(): void {
    if (this.editando && this.clienteActual.id) {
      this.clienteService.actualizar(this.clienteActual.id, this.clienteActual).subscribe(() => {
        this.resetForm();
        this.cargarClientes();
      });
    } else {
      this.clienteService.crear(this.clienteActual).subscribe(() => {
        this.resetForm();
        this.cargarClientes();
      });
    }
  }

  editar(cliente: Cliente): void {
    this.clienteActual = { ...cliente };
    this.editando = true;
  }

  eliminar(id?: number): void {
    if (id && confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clienteService.eliminar(id).subscribe(() => this.cargarClientes());
    }
  }

  resetForm(): void {
    this.clienteActual = { nombre: '', correo: '' };
    this.editando = false;
  }
}
 