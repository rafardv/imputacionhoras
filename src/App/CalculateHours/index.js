import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Pressable, StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { styles } from "./styles";


const MAX_NAME_LENGTH = 14; 

const ImputationsHoursComponent = ({ fechaInicial, fechaFinal }) => {
    const [projects, setProjects] = useState([]);

    /*useEffect(() => {
       
      getProjectsCall()
        .then(response => {
          
            if(response.length > 0){
              setProjects(response);
            }else{
              console.log("no hay proyectos")
            }
          
        })
        .catch(error => {
           
          console.error(error);
        });
    }, []); */
  
    const [items, setItems] = useState([
      { name: "Valencia", image: "" },
      { name: "Somalia", image: "" },
      { name: "Item 3", image: "" },
      { name: "Item 4", image: "" },
      { name: "Item 1", image: "" },
      { name: "Proyecto Silla 2", image: "" },
      { name: "Proyecto intento 128", image: "" },
      { name: "Item 4", image: "" },
      { name: "Item 1", image: "" },
      { name: "Item 2", image: "" },
      { name: "Item 3", image: "" },
      { name: "Item 4", image: "" },
    ]);
    const [selectedItem, setSelectedItem] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);
  
    const handleItemClick = (item, index) => {
      setSelectedItem(item.name);
      setSelectedIndex(index);
    };
  
    const botonClick = () => {
      console.log(selectedItem);
    };
  
    const shortenName = (name) => {
      if (name.length > MAX_NAME_LENGTH) {
        return name.substring(0, MAX_NAME_LENGTH) + "...";
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
          {items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.itemContainer,
              ]}
            >
              <Pressable onPress={() => handleItemClick(item, index)} style={styles.itemContainer}>
                <View style={styles.itemImageContainer}>
                  {item.image ? (
                    <Image source={item.image} style={styles.itemImage} />
                  ) : (
                    <View
                      style={[styles.defaultImage, selectedIndex === index && styles.selectedItemContainer]}
                    />
                  )}
                </View>
                <Text style={styles.itemText}>{shortenName(item.name)}</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        <Text style={styles.selectedItemText}>{selectedItem}</Text>
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
