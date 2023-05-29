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
  TextInput,
  Keyboard,
} from "react-native";
import { styles } from "./styles";
import {
  getProjectCall,
  getProjectsCall,
  updateProjectByPropertyCall,
} from "../Service";
import { UserContext } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const ImputationsHoursComponent = ({ route }) => {
  const { checkIn, checkOut } = route.params;
  const [projects, setProjects] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation();
  const [userListArrayToAdd, setuserListArrayToAdd] = useState([]);
  const [isTextInputOpen, setIsTextInputOpen] = useState(false);
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

        console.log(importedProjects);

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
      console.log(fetchedProject);
      setIsTextInputOpen(false);
      setSearchText(""); // guarar en un usestate
      setFilteredProjects(projects);
      if (selectedProject) {
        if (project.PK == selectedProject.PK) {
          setSelectedProject(null);
        }
      }
    } catch (error) {
      console.log("Error fetching project:", error);
    }
  };

  const handleTitlePress = () => {
    if (isTextInputOpen) {
      setIsTextInputOpen(false);
    } else {
      setIsTextInputOpen(true);
      setSearchText("");
      setFilteredProjects(projects);
    }
  };

  const botonClick = async () => {
    
    const userHoras = {
      userPk: user.pk,
      horas: {
        fechaInicial: checkIn.hour,
        fechaFinal: checkOut.hour,
      },
    };

    if (selectedProject) {
      const userList = [...selectedProject.userList, ...userListArrayToAdd];
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

  const shortenName = (name) => {
    if (name.length > 14) {
      return name.substring(0, 14) + "...";
    }
    return name;
  };

  useEffect(() => {
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().startsWith(searchText.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchText, projects]);

  return (
    <View style={styles.container}>
      <Pressable onPress={handleTitlePress}>
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
        {checkIn.hour}:{checkIn.minutes} || {checkOut.hour}:{checkOut.minutes}
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
