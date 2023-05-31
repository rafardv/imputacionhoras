# APP IMPUTACION HORAS


- [ ] Coger todas las horas al clickar en dia.



## Tareas Rafa:
- [x] Diseño ventana Login
- [x] Funcionalidad inputs login y contraseña
- [x] Funcionalidad para recordar login
- [x] Funcionalidad navegacion entre tabs y ventanas
- [x] Mostrar horas de forma horizontal con scroll.
- [x] Mostrar dias del mes.
- [ ] Hacer scroll en dias.
- [x]  Select de mes en ventana de horas.
  
## Tareas  Javi:
- [x] Diseño ventana imputar
- [x] Funcionalidad llamadas API
- [ ] Imputacion proyecto
- [x] Buscador de proyectos
- [ ] Modal preview confirmar

## Tareas Victor:
- [x] Diseño de la ventana cerrar ses.
- [x] Recoger de la bd la info del user en cerrar ses.
- [x] Funcionalidad para cerrar sesión.
- [x] Funcionalidad para recoger las horas seleccionadas.
- [x] Funcionalidad botón check ventana horas.
- [x] Subir ImputacionList al AsyncStorage.
- [x] cargar hoursList al AsyncStorage.
- [x] Mostrar hasta dia actual.
- [x] contenedor y colores de las horas.



poner de atributo en el objeto de los check un isImputado que sea bool. cuando le imputemos un proyecto en la ventana calculatehours tenemos que actualizar ese objeto poniendo el atributo de isImutado en true. Retornamos ese objeto modificado al componente check y sustiruir ese objeto por el mismo pero desactualizado. tenemos que mapear hourslist para encontrar los checks que han sido actualizados y meterlo en una lista const y esa lista despues meterla en sethourslist.Una vez actualizado, mostrar de alguna forma que han sido imputadas. (podemos ponerle un verde y rojo un poco mas fuertes).