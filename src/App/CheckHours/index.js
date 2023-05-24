import React, { useState } from "react";
import { View, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const CheckHoursComponent = () => {
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState(null);

  const monthChange = (month) => setSelectedMonth(month);

  const openCalculateHours = () =>
    navigation.navigate("ImputationsHoursComponent");

  return (
    <View style={{ flex: 0, justifyContent: "center", alignItems: "center" }}>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={monthChange}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="Enero" value="Enero" />
        <Picker.Item label="Febrero" value="Febrero" />
        <Picker.Item label="Marzo" value="Marzo" />
      </Picker>
      <Button title="A" onPress={openCalculateHours} />
    </View>
  );
};

export default CheckHoursComponent;
