import React, { useState, useEffect, useRef } from "react";
import { View, Button, ScrollView, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format, eachDayOfInterval, getMonth, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import styles from "./styles";
import SelectDropdown from "react-native-select-dropdown";

const CheckHoursComponent = () => {
  const navigation = useNavigation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState();
  const [daysOfMonth, setDaysOfMonth] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isStart, setIsStart] = useState(true);
  const [currentDay, setCurrentDay] = useState(null);
  const scrollViewRef = useRef(null);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const [count, setCount] = useState(0);
  //nos traemos cuando clickamos toda la fecha (año/mes/dia/hora/minuto/segundo)

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

  const checkClick = () => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");

    if (count % 2 === 0) {
      setStartTime(`${hour}${":"}${minutes}`);
      saveToStorage(now);
    } else {
      setEndTime(`${hour}${":"}${minutes}`);
      saveToStorage(now);
    }
    setCount(count + 1);

    setIsStart(!isStart);
  };

  const saveToStorage = async (time) => {
    if (count % 2 === 0) {
      const data = {
        checkInTime: time,
        // Otras propiedades del objeto
      };
      console.log(data.checkInTime.getMinutes());

      
      // Guardar en AsyncStorage u otro método de almacenamiento
    } else {
      const data = {
        checkOutTime: time,
        // Otras propiedades del objeto
      };

      console.log(data.checkOutTime.getMinutes());
      // Guardar en AsyncStorage u otro método de almacenamiento
    }
  };

  useEffect(() => {
    const currentMonth = months[getMonth(new Date())];
    monthChange(currentMonth);
    setCurrentDay(new Date().getDate());
  }, []);

  useEffect(() => {
    if (currentDay && scrollViewRef.current) {
      const dayWidth = 80;
      const scrollOffset = (currentDay - 1) * dayWidth;
      scrollViewRef.current.scrollTo({ x: scrollOffset, animated: true });
    }
  }, [currentDay]);

  const yearChange = (year) => {
    setSelectedYear(year);
    const currentMonth = months[getMonth(new Date())];
    monthChange(currentMonth, year);
  };

  const monthChange = (month, year = selectedYear) => {
    setSelectedMonth(month);

    const yearValue = parseInt(year, 10);
    const monthIndex = months.indexOf(month);
    const firstDayOfMonth = new Date(yearValue, monthIndex, 1);
    const lastDayOfMonth = new Date(yearValue, monthIndex + 1, 0);

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

  const years = Array.from({ length: 2 }, (_, index) =>
    (new Date().getFullYear() - 1 + index).toString()
  );

  console.log("start", startTime);
  console.log("end", endTime);

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <SelectDropdown
          data={months}
          onSelect={(selectedItem) => {
            monthChange(selectedItem);
          }}
          defaultValue={selectedMonth}
        />
        <SelectDropdown
          data={years}
          onSelect={(selectedItem) => {
            yearChange(selectedItem);
          }}
          defaultValue={selectedYear.toString()}
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
              <View>
                <View key={index} style={styles.dayContainer}>
                  <Text
                    style={[
                      styles.dayText,
                      isSameDay(day, new Date()) && styles.currentDayText,
                    ]}
                  >
                    {capitalize(format(day, "EEE d", { locale: es }))}
                  </Text>
                  <View style={styles.dot} />
                </View>
                <View style={styles.horas}>
                  <Text>{startTime}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={checkClick} style={styles.btn}>
        <Text>{isStart ? "Check in" : "Check out"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckHoursComponent;
