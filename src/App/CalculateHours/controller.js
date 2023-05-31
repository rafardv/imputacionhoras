import { Alert } from "react-native";
import { format, eachDayOfInterval, getMonth, isSameDay } from "date-fns";
import {
  getProjectCall,
  getProjectsCall,
  updateProjectByPropertyCall,
} from "../Service";

export const botonClick = async (selectedProject, checkin, checkout, user) => {
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
      imputationList: selectedProject.imputationList,
    });
    console.log(updatedProject);
  }
};

export const showConfirmAlert = (selectedProject, checkin, checkout, botonClick, user) => {
  return Alert.alert(
    "¿Estás seguro?",
    selectedProject.title + "\n" + "\n" + format(new Date(checkin.timestamp), "HH:mm") + " - " + format(new Date(checkout.timestamp), "HH:mm"),
    [
      {
        text: "Si",
        onPress: () => botonClick(selectedProject, checkin, checkout, user),
      },
      {
        text: "No",
      },
    ],
    {
      cancelable: true,
    }
  );
};

export const showNoProjectAlert = () => {
  return Alert.alert("ERROR", "No has seleccionado ningún proyecto", [], {
    cancelable: true,
  });
};