import React, { useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from "react-native";
import { styles } from "./styles";
import { getProjectCall, getProjectsCall } from "../Service";
import { UserContext } from "../UserContext";

const ImputationsHoursComponent = ({ fechaInicial, fechaFinal }) => {
  const [projects, setProjects] = useState([]);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const importedProjects = await getProjectsCall({
          jwtToken: user.jwtToken,
        });

        setProjects(importedProjects);
      } catch (error) {
        console.log("Error fetching projects:", error);
      }
    };

    fetchData();
  }, []);

  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = async (project) => {
    try {
      const fetchedProject = await getProjectCall({
        projectPK: project.PK,
        workspacePK: project.workspace.workspacePK,
        jwtToken: user.jwtToken,
      });

      setSelectedProject(fetchedProject);
    } catch (error) {
      console.log("Error fetching project:", error);
    }
  };

  const botonClick = () => {
    if (selectedProject) {
      console.log("Selected project:", selectedProject.title);
    }
  };

  const shortenName = (name) => {
    if (name.length > 14) {
      return name.substring(0, 14) + "...";
    }
    return name;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IMPUTAR FECHAS</Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.sliderContent}
        showsHorizontalScrollIndicator={false}
        style={styles.contenedorScroll}
      >
        {projects.map((project, index) => (
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
      <Text style={styles.selectedItemText}>
        {selectedProject ? selectedProject.title : "   "}
      </Text>
      <Text style={[styles.selectedItemText, styles.fechasItem]}>
        {fechaInicial} || {fechaFinal}
      </Text>
      <Pressable
        onPress={botonClick}
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
