import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format, eachDayOfInterval, getMonth, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import styles from "./styles";
import SelectDropdown from "react-native-select-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CheckHoursComponent = () => {
  const navigation = useNavigation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState();
  const [daysOfMonth, setDaysOfMonth] = useState([]);
  const [hoursList, setHoursList] = useState([]);
  const [isStart, setIsStart] = useState(true);
  const [currentDay, setCurrentDay] = useState(null);
  const scrollViewRef = useRef(null);
  const reversedDaysOfMonth = [...daysOfMonth].reverse();
  const [twoChecksList, setTwoChecksList] = useState([]);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const currentMonthIndex = new Date().getMonth();

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

  const modifiedMonths = months.slice(0, currentMonthIndex + 1);

  useEffect(() => {
    if (currentDay && scrollViewRef.current) {
      const dayWidth = 80;
      const scrollOffset = (currentDay - 1) * dayWidth;
      scrollViewRef.current.scrollTo({ animated: true });
    }
  }, [currentDay]);

  useEffect(() => {
    const currentMonth = months[getMonth(new Date())];
    monthChange(currentMonth);
    setCurrentDay(new Date().getDate());
    fetchData();
  }, []);

  const collectchecks = (checkList) => {
    const list = [];
    let currentCheckIn = null;
    for (const check of checkList) {
      if (check.label === "check-in") {
        // Si hay un check-in pendiente sin check-out correspondiente, se descarta
        if (currentCheckIn && !currentCheckIn.checkout) {
          continue;
        }
        currentCheckIn = { checkin: check, checkout: null };
        list.push(currentCheckIn);
      } else if (check.label === "check-out") {
        // Si no hay un check-in pendiente, se descarta el check-out
        if (!currentCheckIn) {
          continue;
        }
        currentCheckIn.checkout = check;
        //list.push(currentCheckIn);
        currentCheckIn = null;
      }
    }

    // Si hay un check-in pendiente sin check-out correspondiente al final, se descarta
    if (currentCheckIn && !currentCheckIn.checkout) {
      currentCheckIn = null;
    }

    setTwoChecksList(list);
  };

  useEffect(() => {
    collectchecks(hoursList);
  }, [hoursList]);

  useEffect(() => {
    console.log(twoChecksList);
  });

  const fetchData = async () => {
    try {
      const storageHoursList = await AsyncStorage.getItem("checkHoursList");
      if (storageHoursList !== null) {
        const parsedHoursList = JSON.parse(storageHoursList);
        setHoursList(parsedHoursList);
        console.log("Lista cargada");
      }
    } catch (error) {
      console.log("Error al cargar la lista:", error);
    }
  };

  const yearChange = (year) => {
    setSelectedYear(year);
    const currentMonth = months[getMonth(new Date())];
    monthChange(currentMonth, year);
  };

  const monthChange = (month, year = selectedYear) => {
    setSelectedMonth(month);

    const yearValue = parseInt(year, 10);
    const monthIndex = months.indexOf(month);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    let startMonthIndex = monthIndex - 2;
    let endMonthIndex = monthIndex + 1;
    let startYear = yearValue;

    if (startMonthIndex < 0) {
      startMonthIndex = 0;
      startYear = yearValue - 1;
    }

    const firstDayOfStartMonth = new Date(startYear, startMonthIndex, 1);
    const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0);

    const days = eachDayOfInterval({
      start: firstDayOfStartMonth,
      end: lastDayOfCurrentMonth,
    }).filter((day) => isSameDay(day, currentDate) || day < currentDate);

    setDaysOfMonth(days);
  };

  const openCalculateHours = (checkin, checkout) => {
    console.log(checkin);
    navigation.navigate("ImputationsHoursComponent", {
      checkin,
      checkout,
    });
  };

  const years = Array.from({ length: 2 }, (_, index) =>
    (new Date().getFullYear() - 1 + index).toString()
  );

  const checkClick = async () => {
    const currentTime = new Date();
    const checkTime = {
      id: currentTime.getTime().toString(), // Genera un ID único utilizando el timestamp para recoger los milisegundos
      timestamp: currentTime,
      label: isStart ? "check-in" : "check-out",
    };

    const updatedHoursList = [...hoursList, checkTime];
    setHoursList(updatedHoursList);
    setIsStart(!isStart);

    try {
      const convertedHoursList = JSON.stringify(updatedHoursList); //convierte en cadena json
      await AsyncStorage.setItem("checkHoursList", convertedHoursList);
      await AsyncStorage.setItem("isStart", String(!isStart)); //enviamos el booleano que detecta si es checkin o checkout
      console.log("Check hours saved successfully.");
    } catch (error) {
      console.log("Error saving check hours:", error);
    }

    collectchecks(updatedHoursList);
  };

  useEffect(() => {
    const fetchIsStart = async () => {
      try {
        const storageIsStart = await AsyncStorage.getItem("isStart");
        if (storageIsStart !== null) {
          setIsStart(storageIsStart === "true");
        }
      } catch (error) {
        console.log("Error al cargar si es checkIn/Out:", error);
      }
    };

    fetchIsStart();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <SelectDropdown
          data={modifiedMonths}
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
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contenedorDiasYHoras}>
          <View style={styles.dias}>
            {reversedDaysOfMonth.map((day, index) => {
              const dayChecks = twoChecksList.filter((check) => {
                const { checkin, checkout } = check;
                const checkInDate = new Date(checkin.timestamp);

                const checkOutDate = checkout
                  ? new Date(checkout.timestamp)
                  : null;
                return (
                  isSameDay(day, checkInDate) ||
                  (checkOutDate && isSameDay(day, checkOutDate))
                );
              });

              return (
                <View key={index} style={styles.dayContainer}>
                  <View style={styles.daysContainer2}>
                    <Text
                      style={[
                        styles.dayText,
                        isSameDay(day, new Date()) && styles.currentDayText,
                        
                      ]}
                      onPress={() => openCalculateHours("prueba 1", "prueba2")}
                    >
                      {capitalize(format(day, "EEE d", { locale: es }))}
                    </Text>
                  </View>
                  <View style={styles.dot} />
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.horasContainer}
                    showsHorizontalScrollIndicator={false}
                  >
                    {dayChecks.map((check, hourIndex) => {
                      const { checkin, checkout } = check;
                      const hasCheckOut = checkout !== null;
                      return (
                        <TouchableOpacity
                          key={hourIndex}
                          style={styles.hourContainer}
                          onPress={() => openCalculateHours(checkin, checkout)}
                          disabled={checkout === null}
                        >
                          {hasCheckOut ? (
                            <View style={styles.hourContainerText}>
                              <Text
                                style={[
                                  styles.hourText,
                                  { backgroundColor: "#c0f5b8" },
                                ]}
                              >
                                {checkin.timestamp.toString()}
                              </Text>
                              <Text
                                style={[
                                  styles.hourText,
                                  { backgroundColor: "#f5b9b8" },
                                ]}
                              >
                                {checkout.timestamp.toString()}
                              </Text>
                            </View>
                          ) : (
                            <Text
                              style={[
                                styles.hourText,
                                { backgroundColor: "#c0f5b8" },
                              ]}
                            >
                              {checkin.timestamp.toString()}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              );
            })}
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
