import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilsService } from 'src/app/servicios/utils.service';
import { Notificacion } from 'src/app/clases/notificacion';
import { TipoUsuario } from '../enums/tipo-usuario.enum';
import { FirebaseService } from './firebase.service';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public db: AngularFirestore,
    private utilsService: UtilsService,
    private firebaseService: FirebaseService) { }

  activarNotificaiones(tipoDeUsuario : TipoUsuario)
  {
    this.db.collection('notificaciones').snapshotChanges().subscribe(data => this.verficarNotificaciones(tipoDeUsuario, data));
  }

  obtenerNotificaciones() {
    return this.firebaseService.getDocs('notificaciones').pipe(
      map(users => {
        // Solo usuarios que no esten dados de baja
        return users.filter((u) => (u.payload.doc.data() as Notificacion).fechaBaja === null).map(a => {
          const data = a.payload.doc.data() as Notificacion;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  verficarNotificaciones(tipoDeUsuario : TipoUsuario, datos)
  {
    let notificaciones = datos.map((a: any) => {
      const data = a.payload.doc.data();
      data.id = a.payload.doc.id;
      return data;
    });
    for (const aux of notificaciones) 
    {
      let notificacion : Notificacion = aux;
      if(notificacion.receptor == tipoDeUsuario && notificacion.firstApparition)
      {
        this.lanzarNotificacion(notificacion);
      } 
    }
  }

  lanzarNotificacion(notificacion : Notificacion)
  {
    notificacion.firstApparition = false; //SE LO PONE EN FALSE PARA QUE NO VUELVA A APARECER
    this.actualizarNotificacion(notificacion).then(data => {
      console.log("Notificacion id = " + notificacion.id + " idPedido = " + notificacion.idPedido);
      this.utilsService.presentToast(notificacion.mensaje, "toast-info");
    });
  }

  crearNotificacion(notificacion: Notificacion) 
  {
    return this.firebaseService.addDoc('notificaciones', Object.assign({}, notificacion)).then(data => {
      notificacion.id = data.id;
      this.actualizarNotificacion(notificacion);
    });
  }

  actualizarNotificacion(notificacion: Notificacion) 
  {
    notificacion.fechaModificado = new Date();
    return this.firebaseService.updateDoc('notificaciones', notificacion.id, Object.assign({}, notificacion));
  }

  borrarNotificacion(notificacion: Notificacion)
  {
    notificacion.fechaBaja = new Date();
    return this.firebaseService.updateDoc('notificaciones', notificacion.id, Object.assign({}, notificacion));
  }
}
