import React, { useState } from "react";
import { View, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";

// Resto del código del componente

const CheckHoursComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const handleButtonPress = () => {
    console.log("Selected Month:", selectedMonth);
    // Realiza las acciones que desees con el mes seleccionado
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={handleMonthChange}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="January" value="January" />
        <Picker.Item label="February" value="February" />
        <Picker.Item label="March" value="March" />
        {/* Agrega más opciones de meses según tus necesidades */}
      </Picker>
      <Button
        title="Check Hours"
        onPress={handleButtonPress}
        disabled={!selectedMonth}
      />
    </View>
  );
};

export default CheckHoursComponent;
