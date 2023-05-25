import React, { useState, useEffect, useRef } from "react";
import { View, Button, ScrollView, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format, eachDayOfInterval, getMonth, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import styles from "./styles";
import SelectDropdown from "react-native-select-dropdown";

const CheckHoursComponent = () => {
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState();
  const [daysOfMonth, setDaysOfMonth] = useState([]);
  const [currentDay, setCurrentDay] = useState(null);
  const scrollViewRef = useRef(null);

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

  useEffect(() => {
    const currentMonth = months[getMonth(new Date())];
    monthChange(currentMonth);
    setCurrentDay(new Date().getDate());
  }, []);

  useEffect(() => {
    if (currentDay && scrollViewRef.current) {
      // Calcular el desplazamiento en píxeles para posicionar el día actual visualmente
      const dayWidth = 80; // Ancho de cada día (ajustar según tus necesidades)
      const scrollOffset = (currentDay - 1) * dayWidth; // Desplazamiento en píxeles
      scrollViewRef.current.scrollTo({ x: scrollOffset, animated: true });
    }
  }, [currentDay]);

  const monthChange = (month) => {
    setSelectedMonth(month);

    // Obtener el número de días del mes seleccionado
    const year = new Date().getFullYear(); // Año actual
    const monthIndex = months.indexOf(month); // Índice del mes seleccionado
    const firstDayOfMonth = new Date(year, monthIndex, 1); // Primer día del mes
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0); // Último día del mes

    // Generar un arreglo con los días del mes seleccionado
    const days = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    });

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
        <SelectDropdown
          data={months}
          onSelect={(selectedItem) => {
            monthChange(selectedItem);
          }}
          defaultValue={selectedMonth}
          style={styles.picker}
        />
        <Button title="A" onPress={openCalculateHours} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contenedorDiasYHoras}>
          <View style={styles.dias}>
            {daysOfMonth.map((day, index) => (
              <Text
                key={index}
                style={[
                  styles.dayText,
                  isSameDay(day, new Date()) && styles.currentDayText,
                ]}
              >
                {format(day, "d EEE", { locale: es })}
              </Text>
            ))}
          </View>
          <View style={styles.horas}>
            {/* Aquí puedes mostrar las horas correspondientes a los días */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CheckHoursComponent;
