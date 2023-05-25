import React, { useState } from "react";
import { View, Button, ScrollView, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { format, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";
import styles from "./styles";

const CheckHoursComponent = () => {
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [daysOfMonth, setDaysOfMonth] = useState([]);

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const monthChange = (month) => {
    setSelectedMonth(month);

    // Obtener el número de días del mes seleccionado
    const year = new Date().getFullYear(); // Año actual
    const monthIndex = months.indexOf(month); // Índice del mes seleccionado
    const firstDayOfMonth = new Date(year, monthIndex, 1); // Primero día del mes
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0); // Último día del mes

    // Generar un arreglo con los días del mes seleccionado
    const days = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    });

    // Actualizar el estado con los días del mes
    setDaysOfMonth(days);
  };

  const openCalculateHours = () => {
    navigation.navigate("ImputationsHoursComponent", {
      fechaInicial,
      fechaFinal,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(month) => monthChange(month)}
          style={styles.picker}
        >
          {months.map((month, index) => (
            <Picker.Item key={index} label={month} value={month} />
          ))}
        </Picker>
        <Button title="A" onPress={openCalculateHours} />
      </View>

      <ScrollView>
        {daysOfMonth.map((day, index) => (
          <Text key={index} style={styles.dayText}>
            {format(day, "EEE d", { locale: es })}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

export default CheckHoursComponent;
