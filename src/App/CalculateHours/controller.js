import { Alert } from "react-native";
import { format } from "date-fns";
import { updateProjectByPropertyCall } from "../Service";
import { useState } from "react";

export const botonClick = async (
  selectedProject,
  checkin,
  checkout,
  user,
  updateHoursList,
  dayChecks,
  imputandoArray
) => {

 


  switch (imputandoArray) {
    case false:
      const userHoras = {
        userPk: user.pk,
        horas: {
          fechaInicial: format(new Date(checkin.timestamp), "HH:mm"),
          fechaFinal: format(new Date(checkout.timestamp), "HH:mm"),
        },
      };

      if (selectedProject) {
        const updatedProject = await updateProjectByPropertyCall({
          PK: selectedProject.PK,
          workspacePK: selectedProject.workspacePK,
          jwtToken: user.jwtToken,
          userHoras: userHoras,
          userHorasArray: userHorasArray,
          imputationList: selectedProject.imputationList,
        });
        console.log(updatedProject);
        const imputedCheckIn = { ...checkin, isAssigned: true };
        const imputedCheckOut = { ...checkout, isAssigned: true };
        updateHoursList(imputedCheckIn, imputedCheckOut);

        /*const updateDayChecks = dayChecks.map((check) => {
      return { ...check, isAssigned: true };
    });
    updateHoursList({updateDayChecks});
    HABRIA QUE PONERLE LLAVES A TODAS
    console.log(updateDayChecks);*/
      }
      break;
    case true:
      
    
   

    

    const userHorasArray = {
      userPk: user.pk,
      horas: {
        horas: dayChecks.filter(obj => {
          return obj.checkout.label === "check-out"
        } ),     
      },
    };
    
    if (selectedProject) {
      console.log("wwwwwwwwwww",userHorasArray)
      const updatedProject = await updateProjectByPropertyCall({
        PK: selectedProject.PK,
        workspacePK: selectedProject.workspacePK,
        jwtToken: user.jwtToken,
        userHoras: {horas: {fechaInicial: "", fechaFinal: ""}},
        userHorasArray:  userHorasArray,
        imputationList: selectedProject.imputationList,
      });
      console.log(updatedProject);
      const imputedCheckIn = { ...checkin, isAssigned: true };
      const imputedCheckOut = { ...checkout, isAssigned: true };
      

     
    }
    
  }
};

export const showConfirmAlert = (
  selectedProject,
  checkin,
  checkout,
  botonClick,
  user,
  updateHoursList,
  dayChecks,
  imputandoArray
) => {
  

  if (!dayChecks) {
    return Alert.alert(
      "¿Estás seguro?",
      selectedProject.title +
        "\n" +
        "\n" +
        format(new Date(checkin.timestamp), "HH:mm") +
        " - " +
        format(new Date(checkout.timestamp), "HH:mm"),
      [
        {
          text: "Si",
          onPress: () =>
            botonClick(
              selectedProject,
              checkin,
              checkout,
              user,
              updateHoursList,
              dayChecks,
              imputandoArray
            ),
        },
        {
          text: "No",
        },
      ],
      {
        cancelable: true,
      }
    );
  } else {
    return Alert.alert(
      "¿Estás seguro?",
      selectedProject.title +
        "\n" +
        "\n" +
        "Seguro que quieres imputar todas las  horas?",
      [
        {
          text: "Si",
          onPress: () =>
            botonClick(
              selectedProject,
              checkin,
              checkout,
              user,
              updateHoursList,
              dayChecks,
              imputandoArray
            ),
        },
        {
          text: "No",
        },
      ],
      {
        cancelable: true,
      }
    );
  }
};

export const showNoProjectAlert = () => {
  return Alert.alert("ERROR", "No has seleccionado ningún proyecto", [], {
    cancelable: true,
  });
};
