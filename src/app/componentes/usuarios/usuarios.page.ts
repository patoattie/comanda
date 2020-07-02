import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { UtilsService } from 'src/app/servicios/utils.service';
// import { Usuario } from 'src/app/clases/usuario';
import { EstadoUsuario } from 'src/app/enums/estado-usuario.enum';
import { AuthService } from 'src/app/servicios/auth.service';
import { Usuario } from 'src/app/clases/usuario';
import { EditarUsuarioPage } from './editar-usuario/editar-usuario.page';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  listaUsuarios: any;
  listaAprobados: any;
  listaPendientes: any;

  constructor(
    public usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private authService: AuthService) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.utilsService.presentLoading();
    this.usuarioService.obtenerUsuarios().subscribe(usuarios => {
      this.utilsService.dismissLoading();
      this.listaUsuarios = usuarios;
      this.listaAprobados = this.filtrarAprobados();
      this.listaPendientes = this.filtrarPendientes();
    }, error => console.log(error));
  }

  filtrarPendientes() {
    return this.listaUsuarios.filter(usuario => usuario.estado === EstadoUsuario.PENDIENTE);
  }

  filtrarAprobados() {
    return this.listaUsuarios.filter(usuario => usuario.estado === EstadoUsuario.APROBADO);
  }

  aprobarUsuario(usuario): void {
    this.utilsService.presentLoading();
    this.authService.gestionarUsuario(usuario, EstadoUsuario.APROBADO)
      .then(() => this.utilsService.dismissLoading())
      .catch(err => this.utilsService.dismissLoading());
  }

  declinarUsuario(usuario): void {
    this.utilsService.presentLoading();
    this.authService.gestionarUsuario(usuario, EstadoUsuario.RECHAZADO)
      .then(() => this.utilsService.dismissLoading())
      .catch(err => this.utilsService.dismissLoading());
  }

  volver(): void {
    this.utilsService.showLoadingAndNavigate('home');
  }

  altaUsuario(): void {
    this.utilsService.showLoadingAndNavigate('usuarios/alta-usuarios');
  }

  editarUsuario(usuario: Usuario) {
    const callback = (u: Usuario) => this.usuarioService.actualizarUsuario(u);
    this.utilsService.presentModal(EditarUsuarioPage, { usuario, callback });
  }

  eliminarUsuario(usuario: Usuario) {
    const callback = () => this.usuarioService.borrarUsuario(usuario);
    this.utilsService.presentAlertConfirm('Atención', '¿Estás seguro que deseas borrar este usuario?', callback);
  }

  manejadoraHome(opcion: string): void {
    switch (opcion) {
      case 'DUEÑO':
        localStorage.setItem('tipoDeAlta', opcion);
        this.utilsService.showLoadingAndNavigate('usuarios/alta-usuarios');
        break;

      case 'SUPERVISOR':
        localStorage.setItem('tipoDeAlta', opcion);
        this.utilsService.showLoadingAndNavigate('usuarios/alta-usuarios');
        break;

      case 'EMPLEADO':
        localStorage.setItem('tipoDeAlta', opcion);
        this.utilsService.showLoadingAndNavigate('usuarios/alta-usuarios');
        break;

      case 'CLIENTE_ANONIMO':
        localStorage.setItem('tipoDeAlta', opcion);
        this.utilsService.showLoadingAndNavigate('usuarios/alta-usuarios');
        break;

      case 'CLIENTE_REGISTRADO':
        localStorage.setItem('tipoDeAlta', opcion);
        this.utilsService.showLoadingAndNavigate('usuarios/alta-usuarios');
        break;

      case 'PENDIENTE':
        this.utilsService.showLoadingAndNavigate('usuarios');
        break;
    }
  }

  public abmUsuario(tipoDeAlta: string): void {
    localStorage.setItem('tipoDeAlta', tipoDeAlta);
    this.utilsService.showLoadingAndNavigate('usuarios/alta-usuarios');
  }

  public getPerfil(): string { // PATO
    return localStorage.getItem('perfil');
  }
}
