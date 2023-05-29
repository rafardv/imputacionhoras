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
  const [hoursList, setHoursList] = useState([]);
  const [isStart, setIsStart] = useState(true);
  const [currentDay, setCurrentDay] = useState(null);
  const scrollViewRef = useRef(null);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const [count, setCount] = useState(0);

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
    if (count % 2 === 0) {
      const hourObject = {
        type: "checkIn",
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hour: now.getHours(),
        minutes: now.getMinutes().toString().padStart(2, "0"),
      };
      saveToStorage(now);
      const existingHourObject = hoursList.find(
        (hour) => hour.checkOut === null
      );
      if (!existingHourObject) {
        const hourTwoObjects = {
          checkIn: hourObject,
          checkOut: null,
        };
        setHoursList([...hoursList, hourTwoObjects]);
      }
    } else {
      const hourObject = {
        type: "checkOut",
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hour: now.getHours(),
        minutes: now.getMinutes().toString().padStart(2, "0"),
      };
      saveToStorage(now);
      const existingHourObject = hoursList.find(
        (hour) => hour.checkOut === null
      );
      if (existingHourObject) {
        existingHourObject.checkOut = hourObject;
      }
    }
    setCount(count + 1);
    setIsStart(!isStart);
  };

  const saveToStorage = async (time) => {
    if (count % 2 === 0) {
      const data = {
        checkInTime: time,
      };
      console.log(data.checkInTime.getMinutes(), " check in");
    } else {
      const data = {
        checkOutTime: time,
      };
      console.log(data.checkOutTime.getMinutes(), " check out");
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

  const openCalculateHours = (checkIn, checkOut) => {
    navigation.navigate("ImputationsHoursComponent", {
      checkIn,
      checkOut,
    });
  };

  const years = Array.from({ length: 2 }, (_, index) =>
    (new Date().getFullYear() - 1 + index).toString()
  );

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
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contenedorDiasYHoras}>
          <View style={styles.dias}>
            {daysOfMonth.map((day, index) => {
              const dayHours = hoursList.filter((hour) => {
                const { checkIn, checkOut } = hour;
                const checkInDate = new Date(
                  checkIn.year,
                  checkIn.month - 1,
                  checkIn.day
                );
                const checkOutDate = checkOut
                  ? new Date(checkOut.year, checkOut.month - 1, checkOut.day)
                  : null;
                return (
                  isSameDay(day, checkInDate) ||
                  (checkOutDate && isSameDay(day, checkOutDate))
                );
              });

              return (
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
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.horasContainer}
                    showsHorizontalScrollIndicator={false}
                  >
                    {dayHours.map((check, hourIndex) => {
                      const { checkIn, checkOut } = check;
                      const hasCheckOut = checkOut !== null;

                      return (
                        <TouchableOpacity
                          key={hourIndex}
                          style={styles.hourContainer}
                          onPress={() => openCalculateHours(checkIn, checkOut)}
                          disabled={checkOut === null}
                        >
                          {hasCheckOut ? (
                            <View style={styles.hourContainerText}>
                              <Text
                                style={[
                                  styles.hourText,
                                  { backgroundColor: "green" },
                                ]}
                              >
                                {checkIn.hour}:{checkIn.minutes}
                              </Text>
                              <Text
                                style={[
                                  styles.hourText,
                                  { backgroundColor: "red" },
                                ]}
                              >
                                {checkOut.hour}:{checkOut.minutes}
                              </Text>
                            </View>
                          ) : (
                            <Text
                              style={[
                                styles.hourText,
                                { backgroundColor: "green" },
                              ]}
                            >
                              {checkIn.hour}:{checkIn.minutes}
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
