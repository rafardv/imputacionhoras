import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format, getMonth, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import styles from "./styles";
import SelectDropdown from "react-native-select-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  capitalize,
  collectchecks,
  checkClick,
  fetchData,
  yearChange,
  monthChange,
} from "./controller";

const CheckHoursComponent = () => {
  const navigation = useNavigation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [daysOfMonth, setDaysOfMonth] = useState([]);
  const [hoursList, setHoursList] = useState([]);
  const [isStart, setIsStart] = useState(true);
  const reversedDaysOfMonth = [...daysOfMonth].reverse();
  const [twoChecksList, setTwoChecksList] = useState([]);
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
    const currentMonth = months[getMonth(new Date())];
    monthChange(
      currentMonth,
      selectedYear,
      months,
      setSelectedMonth,
      setDaysOfMonth
    );
    fetchData(setHoursList);
  }, []);

  useEffect(() => {
    collectchecks(hoursList, setTwoChecksList);
  }, [hoursList]);

  useEffect(() => {
    const fetchIsStart = async () => {
      try {
        const storageIsStart = await AsyncStorage.getItem("isStart");
        setLoading(false);
        if (storageIsStart !== null) {
          setIsStart(storageIsStart === "true");
        }
      } catch (error) {
        console.log("Error al cargar si es checkIn/Out:", error);
      }
    };
    fetchIsStart();
  }, []);

  const openCalculateHours = (checkin, checkout) => {
    navigation.navigate("ImputationsHoursComponent", {
      checkin,
      checkout,
      updateHoursList: (imputedCheckIn, imputedCheckOut) => {
        const updatedHoursListConst = hoursList.map((check) => {
          if (check.id === imputedCheckIn.id) {
            return imputedCheckIn;
          }
          if (check.id === imputedCheckOut.id) {
            return imputedCheckOut;
          }
          return check;
        });
        console.log(updatedHoursListConst);
        setHoursList(updatedHoursListConst);
        const convertedHoursList = JSON.stringify(updatedHoursListConst);
        AsyncStorage.setItem("checkHoursList", convertedHoursList)
          .then(() => {
            console.log("Lista de horas actualizada en AsyncStorage");
          })
          .catch((error) => {
            console.log(
              "Error al guardar la lista de horas en AsyncStorage:",
              error
            );
          });
      },
    });
  };

  const years = Array.from({ length: 2 }, (_, index) =>
    (new Date().getFullYear() - 1 + index).toString()
  );

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <SelectDropdown
          data={modifiedMonths}
          onSelect={(selectedItem) => {
            monthChange(
              selectedItem,
              selectedYear,
              months,
              setSelectedMonth,
              setDaysOfMonth
            );
          }}
          defaultValue={selectedMonth}
        />

        <SelectDropdown
          data={years}
          onSelect={(selectedItem) => {
            yearChange(
              selectedItem,
              setSelectedYear,
              months,
              setSelectedMonth,
              setDaysOfMonth
            );
          }}
          defaultValue={selectedYear.toString()}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contenedorDiasYHoras}>
          <View style={styles.dias}>
            {reversedDaysOfMonth.map((day, index) => {
              if (day > new Date()) return null;
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
                                  checkin.isAssigned
                                    ? { backgroundColor: "#75e065" }
                                    : { backgroundColor: "#c0f5b8" },
                                ]}
                              >
                                <Text style={styles.hourText}>
                                  {format(new Date(checkin.timestamp), "HH:mm")}
                                </Text>
                              </Text>
                              <Text
                                style={[
                                  styles.hourText,
                                  checkout.isAssigned
                                    ? { backgroundColor: "#e06965" }
                                    : { backgroundColor: "#f5b9b8" },
                                ]}
                              >
                                <Text style={styles.hourText}>
                                  {format(
                                    new Date(checkout.timestamp),
                                    "HH:mm"
                                  )}
                                </Text>
                              </Text>
                            </View>
                          ) : (
                            <Text
                              style={[
                                styles.hourText,
                                { backgroundColor: "#c0f5b8" },
                              ]}
                            >
                              <Text style={styles.hourText}>
                                {format(new Date(checkin.timestamp), "HH:mm")}
                              </Text>
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
      <TouchableOpacity
        onPress={() =>
          checkClick(
            isStart,
            setIsStart,
            hoursList,
            setHoursList,
            setTwoChecksList
          )
        }
        style={styles.btn}
      >
        <Text>{isStart ? "Check in" : "Check out"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckHoursComponent;
