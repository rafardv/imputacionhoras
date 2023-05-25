import React, { useState } from "react";
import { View, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "./styles";
// Resto del código del componente

const CheckHoursComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  const monthChange = (month) => {
    setSelectedMonth(month);
  };

  return (
    <View style={{ flex: 0, justifyContent: "center", alignItems: "center" }}>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={monthChange}
        style={styles.picker}
      >
        <Picker.Item label="Enero" value="Enero" />
        <Picker.Item label="Febrero" value="Febrero" />
        <Picker.Item label="Marzo" value="Marzo" />
      </Picker>
    </View>
  );
};

//{ height: 50, width: 200 }

export default CheckHoursComponent;
