import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  eachDayOfInterval,
  getMonth,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  subMonths,
} from "date-fns";

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const collectchecks = (hoursList, setTwoChecksList) => {
  const list = [];
  let currentCheckIn = null;
  for (const check of hoursList) {
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
      currentCheckIn = null;
    }
  }

  // Si hay un check-in pendiente sin check-out correspondiente al final, se descarta
  if (currentCheckIn && !currentCheckIn.checkout) {
    currentCheckIn = null;
  }

  setTwoChecksList(list);
};

export const checkClick = async (
  isStart,
  setIsStart,
  hoursList,
  setHoursList,
  setTwoChecksList
) => {
  const currentTime = new Date();
  const checkTime = {
    id: currentTime.getTime().toString(),
    timestamp: currentTime.getTime(), // Guarda la fecha completa en milisegundos
    label: isStart ? "check-in" : "check-out",
    isAssigned: false,
  };

  const updatedHoursList = [...hoursList, checkTime];
  setHoursList(updatedHoursList);
  setIsStart(!isStart);

  try {
    const convertedHoursList = JSON.stringify(updatedHoursList);
    await AsyncStorage.setItem("checkHoursList", convertedHoursList);
    await AsyncStorage.setItem("isStart", String(!isStart));
    console.log("Las horas se han guardado correctamente");
  } catch (error) {
    console.log("Error al guardar las horas:", error);
  }

  collectchecks(updatedHoursList, setTwoChecksList);
};

export const fetchData = async (setHoursList) => {
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

export const yearChange = (
  year,
  setSelectedYear,
  months,
  setSelectedMonth,
  setDaysOfMonth
) => {
  setSelectedYear(year);
  const currentMonth = months[getMonth(new Date())];
  monthChange(currentMonth, year, months, setSelectedMonth, setDaysOfMonth);
};

export const monthChange = (
  month,
  year = selectedYear,
  months,
  setSelectedMonth,
  setDaysOfMonth
) => {
  setSelectedMonth(month);
  const yearValue = parseInt(year, 10);
  const monthIndex = months.indexOf(month);
  const startDate = startOfMonth(new Date(yearValue, monthIndex));
  const endDate = endOfMonth(new Date(yearValue, monthIndex));

  // Obtener los dos meses anteriores
  const prevMonthStartDate = subMonths(startDate, 1);
  const prevMonthEndDate = subMonths(endDate, 1);

  const days = eachDayOfInterval({
    start: prevMonthStartDate,
    end: endDate,
  }).filter(
    (day) =>
      isSameMonth(day, prevMonthStartDate) ||
      isSameMonth(day, prevMonthEndDate) ||
      isSameMonth(day, startDate) ||
      isSameMonth(day, endDate)
  );

  setDaysOfMonth(days);
};

export const updateHoursList = (
  hoursList,
  imputedCheckIn,
  imputedCheckOut,
  updateDayChecks
) => {
  return hoursList.map((check) => {
    let updatedCheck = check;

    if (imputedCheckIn && check.id === imputedCheckIn.id) {
      updatedCheck = imputedCheckIn;
    } else if (imputedCheckOut && check.id === imputedCheckOut.id) {
      updatedCheck = imputedCheckOut;
    } else if (updateDayChecks && updateDayChecks.find) {
      const updatedCheckFromUpdateDayChecks = updateDayChecks.find(
        (updatedCheck) => updatedCheck.id === check.id
      );
      if (updatedCheckFromUpdateDayChecks) {
        updatedCheck = updatedCheckFromUpdateDayChecks;
      }
    }

    return updatedCheck;
  });
};

export const saveIsImputed = (updatedHoursListConst, setHoursList) => {
  console.log("lista en save: ", updatedHoursListConst);
  setHoursList(updatedHoursListConst);
  const convertedHoursList = JSON.stringify(updatedHoursListConst);
  AsyncStorage.setItem("checkHoursList", convertedHoursList)
    .then(() => {
      console.log("Lista de horas actualizada en AsyncStorage");
    })
    .catch((error) => {
      console.log("Error al guardar la lista de horas en AsyncStorage:", error);
    });
};
