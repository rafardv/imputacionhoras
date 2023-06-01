import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { styles } from "./styles";
import {
  getProjectCall,
  getProjectsCall,
  updateProjectByPropertyCall,
} from "../Service";
import { UserContext } from "../UserContext";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { botonClick, showConfirmAlert, showNoProjectAlert } from "./controller";

const ImputationsHoursComponent = ({ route }) => {
  const { checkin, checkout, updateHoursList, dayChecks } = route.params;
  
  const [projects, setProjects] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation();
  const [imputandoArray, setImputandoArray] = useState(false)
  const [searchText, setSearchText] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: "IMPUTAR" });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const importedProjects = await getProjectsCall({
          jwtToken: user.jwtToken,
        });

        setProjects(importedProjects);
      } catch (error) {}
    };
    fetchData();

    if(dayChecks){
      setImputandoArray(true)
    }

  }, []);

  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = async (project) => {
    try {
      const fetchedProject = await getProjectCall({
        projectPK: project.PK,
        workspacePK: project.workspace.workspacePK,
        jwtToken: user.jwtToken,
      });

      if (selectedProject && selectedProject.PK == project.PK) {
        console.log("es el mismo");
        setSelectedProject(null);
      } else {
        setSelectedProject(fetchedProject);
        console.log(fetchedProject);
      }

      setIsTextInputOpen(false);
      setSearchText(""); // guardar en un useState
    } catch (error) {}
  };

  // el filtro buscar
  useEffect(() => {
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().startsWith(searchText.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchText, projects]);

  const shortenName = (name) => {
    if (name.length > 14) {
      return name.substring(0, 14) + "...";
    }
    return name;
  };

  return (
    <View style={styles.container}>
      <Pressable>
        <Text style={styles.title}>
          {selectedProject ? selectedProject.title : "¿Buscas Algo?"}
        </Text>
      </Pressable>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar proyecto..."
        onChangeText={(text) => setSearchText(text)}
      />

      <ScrollView
        horizontal
        contentContainerStyle={styles.sliderContent}
        showsHorizontalScrollIndicator={false}
        style={styles.contenedorScroll}
      >
        {filteredProjects.map((project, index) => (
          <View key={index} style={styles.itemContainer}>
            <Pressable
              onPress={() => handleProjectClick(project)}
              style={styles.itemContainer}
            >
              <View style={styles.itemImageContainer}>
                {project.image ? (
                  <Image source={project.image} style={styles.itemImage} />
                ) : (
                  <View
                    style={[
                      styles.defaultImage,
                      selectedProject &&
                        selectedProject.PK === project.PK &&
                        styles.selectedItemContainer,
                    ]}
                  />
                )}
              </View>
              <Text style={styles.itemText}>{shortenName(project.title)}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <Text style={[styles.selectedItemText, styles.fechasItem]}>
        {checkin && checkout
          ? `${format(new Date(checkin.timestamp), "HH:mm")} || ${format(
              new Date(checkout.timestamp),
              "HH:mm"
            )}`
          : "Todas las horas seleccionadas!"}
      </Text>
      <Pressable
        onPress={
          selectedProject
            ? () =>
                showConfirmAlert(
                  selectedProject,
                  checkin,
                  checkout,
                  botonClick,
                  user,
                  updateHoursList,
                  dayChecks,
                  imputandoArray
                )
            : showNoProjectAlert
        }
        style={styles.btnImputar}
        title="IMPUTAR"
        accessibilityLabel="boton confirmar"
      >
        <Text style={styles.btnText}>CONFIRMAR</Text>
      </Pressable>
    </View>
  );
};

export default ImputationsHoursComponent;
