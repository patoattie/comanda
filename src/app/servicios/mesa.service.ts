import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { map } from 'rxjs/internal/operators/map';
import { Mesa } from '../clases/mesa';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  constructor(private firebaseService: FirebaseService) { }

  // Obtiene foto de la mesa o una default
  obtenerFoto(mesa: Mesa) {
    let foto = '../../../assets/defaultFoto.png';
    if (mesa.foto) {
      foto = 'data:image/jpeg;base64,' + mesa.foto;
    }
    return foto;
  }

  // Obtiene todas las mesas activas
  obtenerMesas() {
    return this.firebaseService.getDocs('mesas').pipe(
      map(mesas => {
        // Solo mesas que no esten dadas de baja
        return mesas.filter((m) => (m.payload.doc.data() as Mesa).fechaBaja === null).map(a => {
          const data = a.payload.doc.data() as Mesa;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  // Obtener mesa por id (id)
  obtenerMesa(uid: string) {
    return this.firebaseService.getDoc('mesas', uid).pipe(
      map((mesa: any) => {
        const data = mesa.payload.data() as Mesa;
        const id = uid;
        return { id, ...data };
      })
    );
  }

  // Crear Mesa (Class Mesa)
  crearMesa(mesa: Mesa) {
    mesa.fechaAlta = new Date();
    return this.firebaseService.addDoc('mesas', Object.assign({}, mesa));
  }

  // Actualizar mesas (Class Mesa)
  actualizarMesa(mesa: Mesa) {
    mesa.fechaModificado = new Date();
    return this.firebaseService.updateDoc('mesas', mesa.id, Object.assign({}, mesa));
  }

  // Borrar Mesa (id)
  // Realizamos baja logica de la mesa
  borrarMesa(mesa: Mesa) {
    mesa.fechaBaja = new Date();
    return this.firebaseService.updateDoc('mesas', mesa.id, Object.assign({}, mesa));
  }
}
